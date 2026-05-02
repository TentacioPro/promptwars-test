import { db } from '../lib/firebase.js';
import { success, notFound } from '../utils/response.js';

/**
 * GET /api/notifications — List notifications (paginated)
 */
export async function listNotifications(req, res, next) {
  try {
    const { uid } = req.user;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;

    let query = db.collection('notifications')
      .where('recipientId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (offset > 0) {
      // For offset-based pagination, we skip using startAfter
      // Simple approach: fetch offset + limit and slice
      const allSnap = await db.collection('notifications')
        .where('recipientId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(offset + limit)
        .get();

      const docs = allSnap.docs.slice(offset);
      const notifications = docs.map((d) => ({ id: d.id, ...d.data() }));

      // Get unread count
      const unreadSnap = await db.collection('notifications')
        .where('recipientId', '==', uid)
        .where('read', '==', false)
        .get();

      return success(res, { notifications, unreadCount: unreadSnap.size });
    }

    const snap = await query.get();
    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const unreadSnap = await db.collection('notifications')
      .where('recipientId', '==', uid)
      .where('read', '==', false)
      .get();

    return success(res, { notifications, unreadCount: unreadSnap.size });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/notifications/:id/read — Mark one as read
 */
export async function markRead(req, res, next) {
  try {
    const docRef = db.collection('notifications').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return notFound(res, 'Notification');

    if (doc.data().recipientId !== req.user.uid) {
      return res.status(403).json({ success: false, error: 'Not your notification' });
    }

    await docRef.update({ read: true });
    return success(res, { message: 'Marked as read' });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/notifications/read-all — Mark all as read
 */
export async function markAllRead(req, res, next) {
  try {
    const { uid } = req.user;
    const snap = await db.collection('notifications')
      .where('recipientId', '==', uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();

    return success(res, { message: `Marked ${snap.size} notifications as read` });
  } catch (err) { next(err); }
}
