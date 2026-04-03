import { z, ZodError } from 'zod';

/**
 * Validates request body against a Zod schema.
 * Returns either { success: true, data } or { success: false, error }
 *
 * Usage in API routes:
 * ```
 * const validation = validateRequest(body, createBookingSchema);
 * if (!validation.success) {
 *   return Response.json({ error: validation.error }, { status: 400 });
 * }
 * const data = validation.data;
 * ```
 */
export function validateRequest<T extends z.ZodType>(
  body: unknown,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: string; details: string[] } {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.issues.map((issue) => issue.message)
      };
    }
    return {
      success: false,
      error: 'Unknown validation error',
      details: []
    };
  }
}

/**
 * Validates and returns the result, or throws a Response error.
 * Convenience wrapper for API route handlers.
 */
export function validateOrThrow<T extends z.ZodType>(
  body: unknown,
  schema: T
): z.infer<T> {
  const result = validateRequest(body, schema);
  if (!result.success) {
    throw new Response(
      JSON.stringify({ error: result.error, details: result.details }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return result.data;
}