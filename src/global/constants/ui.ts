/**
 * Global UI text constants for shared UI elements
 * These should be generic UI elements that appear across modules
 */
export const GLOBAL_UI = {
  // Actions
  ACTIONS: {
    DELETE: "Delete",
    EDIT: "Edit",
  },

  // Buttons
  BUTTONS: {
    APPLY_FILTERS: "Apply Filters",
    DELETE: "Delete",
    DELETING: "Deleting...",
    EDIT: "Edit",
    NEW_TASK: "New task",
    SAVE: "Save",
    SAVE_CHANGES: "Save changes",
    SAVING: "Saving...",
  },

  // Loading
  LOADING: {
    DEFAULT: "Loading...",
  },

  // Messages
  MESSAGES: {
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again later.",
  },

  // Pagination
  PAGINATION: {
    ITEMS_PER_PAGE: "Items per page:",
    OF: "of",
    PAGE: "Page",
    SHOWING: "Showing",
  },

  // Sort
  SORT: {
    ASCENDING: "Ascending",
    DESCENDING: "Descending",
  },
} as const;
