import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { db } from './lib/firebase.js';
import { errorHandler } from './middleware/errorHandler.js';

// ── Route imports ──────────────────────────────────────────
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import taskRoutes from './routes/tasks.js';
import teamRoutes from './routes/team.routes.js';
import profileRoutes from './routes/profile.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import aiRoutes from './routes/ai.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Re-export db for any other modules that need it
export { db };

// ── Express Setup ──────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8080;

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ── API Routes ─────────────────────────────────────────────
// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// ── Static File Serving (Cloud Run Single-Container) ───────
// Serve the built React frontend from ../frontend/dist
const STATIC_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(STATIC_DIR));

// Catch-all: serve React index.html for client-side routing
app.get('*path', (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// ── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Skill Hub server running on port ${PORT}`);
  console.log(`📡 API routes: auth, dashboard, tasks, teams, profile, notifications, ai, upload`);
});

export default app;
