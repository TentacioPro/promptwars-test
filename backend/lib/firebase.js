import admin from 'firebase-admin';

// ── Firebase Admin Initialization ──────────────────────────
// Credential priority:
// 1. FIREBASE_SERVICE_ACCOUNT_JSON env var (CI/CD — injected via GCP Secret Manager)
// 2. GOOGLE_APPLICATION_CREDENTIALS file path (local dev)
// 3. applicationDefault() fallback (Cloud Run with attached SA)
// Never hardcode credentials — see AGENT.md rule #3.
if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (sa.private_key) {
      sa.private_key = sa.private_key.replace(/\\n/g, '\n');
    }
    credential = admin.credential.cert(sa);
  } else {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export default admin;
