import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().default(''),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigneeId: z.string().optional(),
  teamId: z.string().min(1, 'Team ID is required'),
  sprintId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).max(10).optional().default([]),
  requiredSkills: z.array(z.string()).max(10).optional().default([]),
});

export const updateTaskSchema = createTaskSchema.partial();

export const statusSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
});

export const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(1000),
});
