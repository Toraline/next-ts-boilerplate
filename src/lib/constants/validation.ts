/**
 * Validation error messages for schemas and forms
 */
export const VALIDATION_MESSAGES = {
  // Slug validation
  SLUG_MIN_LENGTH: "Slug must have at least 3 characters",
  SLUG_MAX_LENGTH: "Slug must be at most 60 characters",
  SLUG_FORMAT: "Use lowercase letters, numbers, and dashes",
  SLUG_CUID_ERROR: "Slug cannot be a cuid",

  // Name validation
  NAME_TOO_SHORT: "Name too short",
  NAME_TOO_LONG: "Name too long",

  // Description validation
  DESCRIPTION_MAX_LENGTH: "Max 500 chars",
  DESCRIPTION_REQUIRED: "Description is required",

  // Update validation
  AT_LEAST_ONE_FIELD_REQUIRED: "At least one field to update is required",

  // General validation
  INVALID_INPUT: "Invalid input",
} as const;
