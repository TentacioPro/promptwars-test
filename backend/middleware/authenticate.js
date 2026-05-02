import admin from '../lib/firebase.js';

/**
 * Firebase Auth middleware.
 * - If a valid Bearer token is present, decodes it and attaches req.user.
 * - If no token is present, falls through with a placeholder user (dev-mode).
 *   This allows the frontend to work without login while auth is being built.
 * - If a token IS present but invalid, returns 401.
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No auth header → allow through with a dev placeholder
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { uid: 'dev-user', email: 'dev@skillhub.local', name: 'Dev User' };
    console.log('[Auth] No token provided — using dev placeholder user.');
    return next();
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log(`[Auth] Authenticated user: ${decodedToken.email || decodedToken.uid}`);
    next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Strict auth middleware — always requires a valid token.
 * Use this for sensitive routes once auth is fully wired up.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
