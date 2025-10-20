/**
 * Category-specific error messages
 * All error messages related to category operations
 */
export const CATEGORY_ERRORS = {
  // CRUD Operations
  CREATE_CATEGORY_ERROR: "Failed to create category",
  DELETE_CATEGORY_ERROR: "Failed to delete category",
  GET_CATEGORIES_ERROR: "Failed to get categories",
  UPDATE_CATEGORY_ERROR: "Failed to update category",

  // Category-specific errors
  CATEGORY_EXISTS_ERROR: "Category with this slug already exists",
  CATEGORY_NOT_FOUND_ERROR: "Category not found",

  // UI Loading Errors
  ERROR_LOADING_CATEGORIES: "Error loading categories",
  ERROR_LOADING_CATEGORY: "Error loading category",

  // Field Validation
  NAME_EMPTY_ERROR: "Name can not be empty",
  NAME_TYPE_ERROR: "Name should be a string",
  NO_FIELDS_TO_UPDATE_ERROR: "No fields to update",
  SLUG_EMPTY_ERROR: "Slug can not be empty",
  SLUG_TYPE_ERROR: "Slug should be a string",

  // General
  VALIDATION_ERROR: "Validation error",
} as const;
