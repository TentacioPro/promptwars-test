import { z } from 'zod';

// ── User / Profile Schemas ─────────────────────────────────

export const registerSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100),
  email: z.string().email('Invalid email address'),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string().max(50)).max(20).optional(),
  avatarUrl: z.string().url().optional(),
  role: z.string().max(100).optional(),
});
