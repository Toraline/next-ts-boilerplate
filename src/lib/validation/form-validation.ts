import { ZodError } from "zod";

/**
 * Converts Zod validation errors to field-specific error object
 */
export function getFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    fieldErrors[path] = issue.message;
  });

  return fieldErrors;
}

/**
 * Gets error message for a specific field from form errors
 */
export function getFieldError(
  fieldName: string,
  errors: Record<string, string>,
): string | undefined {
  return errors[fieldName];
}
