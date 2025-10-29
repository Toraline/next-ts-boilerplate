/**
 * Task-specific error messages
 * All error messages related to task operations
 */
export const TASK_ERRORS = {
  // CRUD Operations
  CREATE_TASK_ERROR: "Failed to create task",
  DELETE_TASK_ERROR: "Failed to delete task",
  GET_CATEGORIES_ERROR: "Failed to get categories",
  UPDATE_TASK_ERROR: "Failed to update task",

  // Task-specific errors
  TASK_NOT_FOUND_ERROR: "Task not found",

  // UI Loading Errors
  ERROR_LOADING_TASKS: "Error loading tasks",
  ERROR_LOADING_TASK: "Error loading task",

  // Field Validation
  NO_FIELDS_TO_UPDATE_ERROR: "No fields to update",
  DESCRIPTION_MAX_LENGTH: "Max 1000 chars",

  // General
  VALIDATION_ERROR: "Validation error",
} as const;
