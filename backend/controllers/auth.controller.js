import { db } from '../lib/firebase.js';
import { success, error } from '../utils/response.js';

// ── Auth Controller ────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a user document in Firestore on first login.
 * Expects req.user (from authenticate middleware) and validated body.
 */
export async function register(req, res, next) {
  try {
    const { uid, email: tokenEmail, picture } = req.user;
    const { displayName, email } = req.body;

    // Check if user doc already exists
    const userRef = db.collection('users').doc(uid);
    const existing = await userRef.get();

    if (existing.exists) {
      return success(res, { uid, ...existing.data() });
    }

    const now = new Date().toISOString();
    const userData = {
      uid,
      email: email || tokenEmail,
      displayName,
      bio: '',
      role: '',
      skills: [],
      avatarUrl: picture || '',
      teamIds: [],
      velocityHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    await userRef.set(userData);
    return success(res, userData, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns the current user's profile from Firestore.
 */
export async function getCurrentUser(req, res, next) {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return error(res, 'User profile not found. Please register first.', 404);
    }

    return success(res, { uid, ...userDoc.data() });
  } catch (err) {
    next(err);
  }
}
