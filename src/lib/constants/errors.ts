/**
 * Client-side error messages
 */
export const CLIENT_ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: "Network error. Please check your connection.",

  // Generic errors
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",

  // Response errors
  REQUEST_FAILED: (status: number) => `Request failed with status ${status}`,
  INVALID_RESPONSE_FORMAT: "Invalid response format",

  // Server-side error messages
  NOT_FOUND_DEFAULT: "Not found",
  UNIQUE_CONSTRAINT_FAILED: "Unique constraint failed",
  RECORD_NOT_FOUND: "Record not found",
} as const;
