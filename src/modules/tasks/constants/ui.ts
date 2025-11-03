/**
 * Task-specific UI text constants
 * All text that appears in task-related components
 */
export const TASKS_UI = {
  // Confirmations
  CONFIRMATIONS: {
    DELETE_TASK: "Are you sure you want to delete this task?",
  },

  // Empty States
  EMPTY_STATES: {
    TASK_NOT_FOUND: "Task not found",
    CREATE_FIRST_TASK: "Create your first task",
    NO_TASKS_FOUND: "No tasks found",
  },

  // Form Messages
  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
  },

  // Headers and Titles
  HEADERS: {
    TASKS: "Tasks",
    NEW_TASK: "New Task",
  },

  // Labels
  LABELS: {
    DESCRIPTION: "Description",
  },

  // Links
  LINKS: {
    CREATE_TASK: "Create Task",
  },

  // Loading States
  LOADING: {
    LOADING_TASK: "Loading task...",
  },

  // Pagination
  PAGINATION: {
    TASKS: "tasks",
  },

  // Placeholders
  PLACEHOLDERS: {
    DESCRIPTION: "Enter the task description",
    SEARCH: "Search by description",
  },

  // Sort Options
  SORT_OPTIONS: {
    CREATED_AT: "Created Date",
    DESCRIPTION: "Description",
    CHECKED: "Checked",
    CATEGORYID: "CategoryId",
    UPDATED_AT: "Updated Date",
  },

  // Table Columns
  TABLE_COLUMNS: {
    ACTIONS: "Actions",
    CREATED: "Created",
    DESCRIPTION: "Description",
    UPDATED: "Updated",
  },
} as const;
