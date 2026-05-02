import { z } from 'zod';

// ── Invite Schemas ─────────────────────────────────────────

export const joinTeamSchema = z.object({
  code: z.string().length(8, 'Invite code must be exactly 8 characters'),
});
