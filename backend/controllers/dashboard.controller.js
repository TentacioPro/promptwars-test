import { db } from '../lib/firebase.js';
import { success } from '../utils/response.js';

// ── Dashboard Controller ───────────────────────────────────

/**
 * GET /api/dashboard/stats
 * Returns aggregated task counts by status, team count, and velocity for the current user.
 */
export async function getStats(req, res, next) {
  try {
    const { uid } = req.user;

    // Get user's teams
    const userDoc = await db.collection('users').doc(uid).get();
    const teamIds = userDoc.exists ? userDoc.data().teamIds || [] : [];

    // Count tasks by status across user's teams
    const stats = { todo: 0, in_progress: 0, review: 0, done: 0, total: 0 };

    if (teamIds.length > 0) {
      // Firestore 'in' queries support max 30 values per disjunction
      const batchSize = 30;
      for (let i = 0; i < teamIds.length; i += batchSize) {
        const batch = teamIds.slice(i, i + batchSize);
        const snapshot = await db
          .collection('tasks')
          .where('teamId', 'in', batch)
          .get();

        snapshot.forEach((doc) => {
          const status = doc.data().status;
          if (stats[status] !== undefined) {
            stats[status]++;
          }
          stats.total++;
        });
      }
    }

    return success(res, {
      taskCounts: stats,
      teamCount: teamIds.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/activity
 * Returns the last 20 activity log entries for the user's teams.
 */
export async function getActivity(req, res, next) {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();
    const teamIds = userDoc.exists ? userDoc.data().teamIds || [] : [];

    let activities = [];

    if (teamIds.length > 0) {
      const batchSize = 30;
      for (let i = 0; i < teamIds.length; i += batchSize) {
        const batch = teamIds.slice(i, i + batchSize);
        const snapshot = await db
          .collection('activityLog')
          .where('teamId', 'in', batch)
          .orderBy('createdAt', 'desc')
          .limit(20)
          .get();

        snapshot.forEach((doc) => {
          activities.push({ id: doc.id, ...doc.data() });
        });
      }

      // Sort combined results and take top 20
      activities.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      activities = activities.slice(0, 20);
    }

    return success(res, { activities });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/health-map
 * Burnout Radar — returns team workload heatmap data.
 * Counts active tasks (todo + in_progress) per team member.
 */
export async function getHealthMap(req, res, next) {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();
    const teamIds = userDoc.exists ? userDoc.data().teamIds || [] : [];

    const memberWorkload = {};

    if (teamIds.length > 0) {
      const batchSize = 30;
      for (let i = 0; i < teamIds.length; i += batchSize) {
        const batch = teamIds.slice(i, i + batchSize);
        const snapshot = await db
          .collection('tasks')
          .where('teamId', 'in', batch)
          .where('status', 'in', ['todo', 'in_progress', 'review'])
          .get();

        snapshot.forEach((doc) => {
          const assigneeId = doc.data().assigneeId;
          if (assigneeId) {
            memberWorkload[assigneeId] = (memberWorkload[assigneeId] || 0) + 1;
          }
        });
      }
    }

    // Convert to heatmap-friendly array
    const heatmap = Object.entries(memberWorkload).map(([uid, activeTasks]) => ({
      uid,
      activeTasks,
      intensity: activeTasks <= 3 ? 'low' : activeTasks <= 6 ? 'medium' : activeTasks <= 9 ? 'high' : 'critical',
    }));

    return success(res, { heatmap });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/standup
 * Returns the latest auto-generated standup digest for the user's primary team.
 */
export async function getStandup(req, res, next) {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();
    const teamIds = userDoc.exists ? userDoc.data().teamIds || [] : [];

    if (teamIds.length === 0) {
      return success(res, { digest: null });
    }

    // Get the latest digest for the first team
    const snapshot = await db
      .collection('standupDigests')
      .where('teamId', '==', teamIds[0])
      .orderBy('generatedAt', 'desc')
      .limit(1)
      .get();

    const digest = snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    return success(res, { digest });
  } catch (err) {
    next(err);
  }
}
