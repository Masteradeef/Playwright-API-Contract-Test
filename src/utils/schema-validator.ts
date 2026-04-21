import { ZodSchema, ZodError } from "zod";

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ZodError["issues"];
}

/**
 * Validates data against a Zod schema and returns a structured result.
 */
export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

/**
 * Validates an array of items against a schema individually.
 * Returns per-item validation results.
 */
export function validateArraySchema<T>(
  schema: ZodSchema<T>,
  data: unknown[]
): { allValid: boolean; results: ValidationResult<T>[] } {
  const results = data.map((item) => validateSchema(schema, item));
  const allValid = results.every((r) => r.success);
  return { allValid, results };
}

/**
 * Formats Zod validation errors into readable strings.
 */
export function formatValidationErrors(errors: ZodError["issues"]): string[] {
  return errors.map((issue) => {
    const path = issue.path.join(".");
    return `[${issue.code}] ${path ? path + ": " : ""}${issue.message}`;
  });
}
