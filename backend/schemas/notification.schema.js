import { z } from 'zod';

// ── Notification Schemas ───────────────────────────────────

export const notificationTypeEnum = z.enum([
  'task_assigned',
  'status_changed',
  'comment_added',
  'team_invite',
  'burnout_alert',
]);

export const createNotificationSchema = z.object({
  recipientId: z.string().min(1),
  type: notificationTypeEnum,
  message: z.string().min(1).max(500),
  referenceId: z.string().optional(),
  referenceType: z.enum(['task', 'team']).optional(),
});
