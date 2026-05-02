import { z } from 'zod';

// ── Team Schemas ───────────────────────────────────────────

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  description: z.string().max(500).optional().default(''),
});

export const updateTeamSchema = createTeamSchema.partial();
