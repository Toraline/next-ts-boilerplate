/**
 * Category-specific UI text constants
 * All text that appears in category-related components
 */
export const CATEGORIES_UI = {
  // Confirmations
  CONFIRMATIONS: {
    DELETE_CATEGORY: "Are you sure you want to delete this category?",
  },

  // Empty States
  EMPTY_STATES: {
    CATEGORY_NOT_FOUND: "Category not found",
    CREATE_FIRST_CATEGORY: "Create your first category",
    NO_CATEGORIES_FOUND: "No categories found",
    NO_DESCRIPTION: "No description",
    TRY_ADJUSTING_FILTERS: "Try adjusting your search or filters",
  },

  // Form Messages
  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
  },

  // Headers and Titles
  HEADERS: {
    CATEGORIES: "Categories",
    NEW_CATEGORY: "New Category",
    TASKS: "Tasks",
  },

  // Labels
  LABELS: {
    DESCRIPTION: "Description",
    NAME: "Name",
    SLUG: "Slug",
  },

  // Links
  LINKS: {
    CREATE_CATEGORY: "Create Category",
  },

  // Loading States
  LOADING: {
    LOADING_CATEGORIES: "Loading categories...",
    LOADING_CATEGORY: "Loading category...",
  },

  // Pagination
  PAGINATION: {
    CATEGORIES: "categories",
  },

  // Placeholders
  PLACEHOLDERS: {
    DESCRIPTION: "Enter the category description",
    NAME: "Enter the name of the category",
    SEARCH: "Search by name/slug/description",
    SLUG: "Enter the slug of the category",
    descriptionWithName: (name: string) => `${name} description`,
  },

  // Sort Options
  SORT_OPTIONS: {
    CREATED_AT: "Created Date",
    NAME: "Name",
    SLUG: "Slug",
    UPDATED_AT: "Updated Date",
  },

  // Table Columns
  TABLE_COLUMNS: {
    ACTIONS: "Actions",
    CREATED: "Created",
    DESCRIPTION: "Description",
    NAME: "Name",
    SLUG: "Slug",
    UPDATED: "Updated",
  },
} as const;
