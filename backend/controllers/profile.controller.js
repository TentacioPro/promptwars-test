import { db } from '../lib/firebase.js';
import { success, notFound } from '../utils/response.js';

/**
 * GET /api/profile — Get own profile
 */
export async function getProfile(req, res, next) {
  try {
    const { uid } = req.user;
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return notFound(res, 'Profile');
    return success(res, { uid, ...doc.data() });
  } catch (err) { next(err); }
}

/**
 * PUT /api/profile — Update profile + skills
 */
export async function updateProfile(req, res, next) {
  try {
    const { uid } = req.user;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) return notFound(res, 'Profile');

    const now = new Date().toISOString();
    const updates = { ...req.body, updatedAt: now };
    await userRef.update(updates);

    return success(res, { uid, ...doc.data(), ...updates });
  } catch (err) { next(err); }
}
