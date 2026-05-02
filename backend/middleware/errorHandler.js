import { ZodError } from 'zod';

/**
 * Global error-handling middleware.
 * Catches Zod validation errors and returns standardized 400 responses.
 * See AGENT.md rule #3.
 */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  console.error('[Server Error]', err.message || err);
  res.status(500).json({ error: 'Internal Server Error' });
}
