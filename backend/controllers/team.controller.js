import { db } from '../lib/firebase.js';
import { success, created, notFound, error } from '../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/teams — List user's teams
 */
export async function listTeams(req, res, next) {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();
    const teamIds = userDoc.exists ? userDoc.data().teamIds || [] : [];
    if (teamIds.length === 0) return success(res, { teams: [] });

    const teams = [];
    for (let i = 0; i < teamIds.length; i += 30) {
      const batch = teamIds.slice(i, i + 30);
      const snap = await db.collection('teams').where('__name__', 'in', batch).get();
      snap.forEach((d) => teams.push({ id: d.id, ...d.data() }));
    }
    return success(res, { teams });
  } catch (err) { next(err); }
}

/**
 * GET /api/teams/:id — Team detail
 */
export async function getTeam(req, res, next) {
  try {
    const doc = await db.collection('teams').doc(req.params.id).get();
    if (!doc.exists) return notFound(res, 'Team');
    return success(res, { id: doc.id, ...doc.data() });
  } catch (err) { next(err); }
}

/**
 * POST /api/teams — Create team
 */
export async function createTeam(req, res, next) {
  try {
    const { uid } = req.user;
    const { name, description } = req.body;
    const now = new Date().toISOString();
    const inviteCode = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();

    const teamData = {
      name, description, ownerId: uid,
      members: [{ uid, role: 'owner', joinedAt: now }],
      inviteCode,
      inviteCodeExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentSprintId: null, createdAt: now, updatedAt: now,
    };
    const docRef = await db.collection('teams').add(teamData);

    // Add team to user's teamIds
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      await userRef.update({ teamIds: [...(userDoc.data().teamIds || []), docRef.id] });
    }

    await db.collection('activityLog').add({
      actorId: uid, action: 'team_created', entityType: 'team',
      entityId: docRef.id, teamId: docRef.id, metadata: { name }, createdAt: now,
    });

    return created(res, { id: docRef.id, ...teamData });
  } catch (err) { next(err); }
}

/**
 * PUT /api/teams/:id — Update team (owner only)
 */
export async function updateTeam(req, res, next) {
  try {
    const { uid } = req.user;
    const docRef = db.collection('teams').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return notFound(res, 'Team');
    if (doc.data().ownerId !== uid) return error(res, 'Only the team owner can update', 403);

    const now = new Date().toISOString();
    const updates = { ...req.body, updatedAt: now };
    await docRef.update(updates);
    return success(res, { id: doc.id, ...doc.data(), ...updates });
  } catch (err) { next(err); }
}

/**
 * DELETE /api/teams/:id — Delete team (owner only)
 */
export async function deleteTeam(req, res, next) {
  try {
    const { uid } = req.user;
    const docRef = db.collection('teams').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return notFound(res, 'Team');
    if (doc.data().ownerId !== uid) return error(res, 'Only owner can delete', 403);

    const teamData = doc.data();
    const batch = db.batch();
    for (const m of teamData.members || []) {
      const mRef = db.collection('users').doc(m.uid);
      const mDoc = await mRef.get();
      if (mDoc.exists) {
        batch.update(mRef, { teamIds: (mDoc.data().teamIds || []).filter((id) => id !== req.params.id) });
      }
    }
    batch.delete(docRef);
    await batch.commit();
    return success(res, { message: 'Team deleted' });
  } catch (err) { next(err); }
}

/**
 * POST /api/teams/:id/invite — Generate invite code
 */
export async function generateInvite(req, res, next) {
  try {
    const { uid } = req.user;
    const docRef = db.collection('teams').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return notFound(res, 'Team');
    if (doc.data().ownerId !== uid) return error(res, 'Only owner can generate invites', 403);

    const inviteCode = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const inviteCodeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await docRef.update({ inviteCode, inviteCodeExpiry });
    return success(res, { inviteCode, inviteCodeExpiry });
  } catch (err) { next(err); }
}

/**
 * POST /api/teams/join/:code — Join team via invite
 */
export async function joinTeam(req, res, next) {
  try {
    const { uid } = req.user;
    const { code } = req.params;
    const snap = await db.collection('teams').where('inviteCode', '==', code.toUpperCase()).limit(1).get();
    if (snap.empty) return error(res, 'Invalid invite code', 404);

    const teamDoc = snap.docs[0];
    const teamData = teamDoc.data();
    if (teamData.inviteCodeExpiry && new Date(teamData.inviteCodeExpiry) < new Date()) {
      return error(res, 'Invite code expired', 410);
    }
    if ((teamData.members || []).some((m) => m.uid === uid)) {
      return error(res, 'Already a member', 409);
    }

    const now = new Date().toISOString();
    await db.collection('teams').doc(teamDoc.id).update({
      members: [...(teamData.members || []), { uid, role: 'member', joinedAt: now }],
      updatedAt: now,
    });

    const userRef = db.collection('users').doc(uid);
    const userDoc2 = await userRef.get();
    if (userDoc2.exists) {
      const ids = userDoc2.data().teamIds || [];
      if (!ids.includes(teamDoc.id)) await userRef.update({ teamIds: [...ids, teamDoc.id] });
    }

    await db.collection('activityLog').add({
      actorId: uid, action: 'member_joined', entityType: 'team',
      entityId: teamDoc.id, teamId: teamDoc.id, metadata: {}, createdAt: now,
    });

    return success(res, { message: 'Joined team', teamId: teamDoc.id, teamName: teamData.name });
  } catch (err) { next(err); }
}

/**
 * DELETE /api/teams/:id/members/:uid — Remove member
 */
export async function removeMember(req, res, next) {
  try {
    const { uid: requesterId } = req.user;
    const { id: teamId, uid: targetUid } = req.params;
    const docRef = db.collection('teams').doc(teamId);
    const doc = await docRef.get();
    if (!doc.exists) return notFound(res, 'Team');

    const teamData = doc.data();
    if (teamData.ownerId !== requesterId && requesterId !== targetUid) {
      return error(res, 'Only owner can remove others', 403);
    }
    if (targetUid === teamData.ownerId) {
      return error(res, 'Owner cannot leave. Transfer ownership or delete team.', 400);
    }

    const now = new Date().toISOString();
    await docRef.update({ members: (teamData.members || []).filter((m) => m.uid !== targetUid), updatedAt: now });

    const userRef = db.collection('users').doc(targetUid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      await userRef.update({ teamIds: (userDoc.data().teamIds || []).filter((id) => id !== teamId) });
    }
    return success(res, { message: 'Member removed' });
  } catch (err) { next(err); }
}
