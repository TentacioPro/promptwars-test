import { db } from '../lib/firebase.js';

export const listTasks = async (req, res, next) => {
  try {
    const { teamId, status, assigneeId } = req.query;
    
    let query = db.collection('tasks').orderBy('createdAt', 'desc');
    
    if (teamId) query = query.where('teamId', '==', teamId);
    if (status) query = query.where('status', '==', status);
    if (assigneeId) query = query.where('assigneeId', '==', assigneeId);

    const snapshot = await query.get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const docRef = db.collection('tasks').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ error: 'Task not found' });
    
    // Also fetch comments
    const commentsSnapshot = await docRef.collection('comments').orderBy('createdAt', 'asc').get();
    const comments = commentsSnapshot.docs.map(c => ({ id: c.id, ...c.data() }));
    
    res.json({ task: { id: doc.id, ...doc.data(), comments } });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
      creatorId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };
    
    const docRef = await db.collection('tasks').add(taskData);
    
    // Log activity
    await db.collection('activityLog').add({
      actorId: req.user.uid,
      action: 'task_created',
      entityType: 'task',
      entityId: docRef.id,
      teamId: taskData.teamId,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: docRef.id, ...taskData });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const docRef = db.collection('tasks').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Task not found' });

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    await docRef.update(updates);
    
    res.json({ id: doc.id, ...doc.data(), ...updates });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const docRef = db.collection('tasks').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ error: 'Task not found' });
    
    const taskData = doc.data();
    const updates = { 
      status, 
      updatedAt: new Date().toISOString(),
      completedAt: status === 'done' ? new Date().toISOString() : taskData.completedAt 
    };
    
    await docRef.update(updates);

    // Log activity
    await db.collection('activityLog').add({
      actorId: req.user.uid,
      action: 'task_status_changed',
      entityType: 'task',
      entityId: doc.id,
      teamId: taskData.teamId,
      metadata: { from: taskData.status, to: status },
      createdAt: new Date().toISOString()
    });

    res.json({ id: doc.id, ...taskData, ...updates });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const docRef = db.collection('tasks').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Task not found' });

    await docRef.delete();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const docRef = db.collection('tasks').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ error: 'Task not found' });
    
    const commentData = {
      text,
      authorId: req.user.uid,
      createdAt: new Date().toISOString()
    };
    
    const commentRef = await docRef.collection('comments').add(commentData);
    
    res.status(201).json({ id: commentRef.id, ...commentData });
  } catch (err) {
    next(err);
  }
};
