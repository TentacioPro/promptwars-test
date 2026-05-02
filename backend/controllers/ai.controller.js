import { db } from '../lib/firebase.js';
import { generateJSON } from '../lib/gemini.js';

export const suggestAssignee = async (req, res, next) => {
  try {
    const { title, description, teamId, requiredSkills } = req.body;
    
    if (!teamId) return res.status(400).json({ error: 'teamId is required' });

    // Fetch team members and their profiles
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) return res.status(404).json({ error: 'Team not found' });
    
    const members = teamDoc.data().members || [];
    const profiles = [];
    
    for (const member of members) {
      const userDoc = await db.collection('users').doc(member.uid).get();
      if (userDoc.exists) {
        profiles.push({ uid: member.uid, ...userDoc.data() });
      }
    }

    const prompt = `
      You are an AI task allocator.
      Task Title: "${title}"
      Task Description: "${description || ''}"
      Required Skills: ${requiredSkills ? requiredSkills.join(', ') : 'Not explicitly specified'}
      
      Team Members:
      ${JSON.stringify(profiles.map(p => ({ uid: p.uid, name: p.displayName, skills: p.skills, role: p.role })), null, 2)}
      
      Evaluate the team members based on their skills and role matching the task requirements.
      Return a JSON array of the top 3 candidates, with 'uid', 'name', 'matchScore' (0-100), and 'reason'.
    `;

    const suggestions = await generateJSON(prompt);
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};

export const generateStandup = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    
    // Fetch last 24 hours of activity for the team
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const activitiesSnapshot = await db.collection('activityLog')
      .where('teamId', '==', teamId)
      .where('createdAt', '>=', yesterday.toISOString())
      .get();
      
    const activities = activitiesSnapshot.docs.map(d => d.data());
    
    if (activities.length === 0) {
      return res.json({ digest: "No activity recorded in the last 24 hours." });
    }

    // Fetch task details for the activities to provide context
    const taskIds = [...new Set(activities.filter(a => a.entityType === 'task').map(a => a.entityId))];
    const tasks = [];
    for (const id of taskIds) {
      const doc = await db.collection('tasks').doc(id).get();
      if (doc.exists) tasks.push({ id, ...doc.data() });
    }

    const prompt = `
      You are an AI Scrum Master. Generate a daily standup digest for the team based on the activity logs and tasks from the last 24 hours.
      
      Activities: ${JSON.stringify(activities)}
      Task Context: ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title })))}
      
      Return a JSON object with a 'summaries' array. Each item should have:
      'uid' (actor ID), 'completed' (array of strings), 'inProgress' (array of strings), 'blocked' (array of strings).
    `;

    const digest = await generateJSON(prompt);
    
    // Save digest to DB
    const digestDoc = {
      teamId,
      date: new Date().toISOString().split('T')[0],
      summaries: digest.summaries || digest,
      generatedAt: new Date().toISOString()
    };
    
    await db.collection('standupDigests').add(digestDoc);
    
    res.json(digestDoc);
  } catch (err) {
    next(err);
  }
};
