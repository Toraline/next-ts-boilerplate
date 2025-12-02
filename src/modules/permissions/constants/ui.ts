/**
 * Permission-specific UI text constants
 * All text that appears in permission-related components
 */

export const PERMISSIONS_UI = {
  //Confirmations
  CONFIRMATIONS: {
    DELETE_PERMISSION: "Are you sure you want to delete this permission?",
  },

  //Empty States
  EMPTY_STATES: {
    PERMISSION_NOT_FOUND: "Permission not found",
    NO_PERMISSIONS_FOUND: "No permissions found",
    TRY_ADJUSTING_FILTERS: "Try adjusting your search or filters",
  },

  //Form Messages
  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
  },

  //Headers and Titles
  HEADERS: {
    PERMISSIONS: "Permissions",
    NEW_PERMISSION: "New Permission",
  },

  //Labels
  LABELS: {
    KEY: "Key",
    NAME: "Name",
    DESCRIPTION: "Description",
  },

  //Links
  LINKS: {
    CREATE_PERMISSION: "Create Permission",
  },

  //Loading States
  LOADING: {
    LOADING_PERMISSIONS: "Loading permissions...",
    LOADING_PERMISSION: "Loading permission...",
  },

  // Pagination
  PAGINATION: {
    PERMISSIONS: "permissions",
  },

  //Placeholders
  PLACEHOLDERS: {
    KEY: "Enter the permission key",
    NAME: "Enter the permission name",
    DESCRIPTION: "Enter the permission description",
    SEARCH: "Search by key/name/description",
  },

  // Sort Options
  SORT_OPTIONS: {
    CREATED_AT: "Created Date",
    KEY: "Key",
    NAME: "Name",
    UPDATED_AT: "Updated Date",
  },

  // Table Columns
  TABLE_COLUMNS: {
    ACTIONS: "Actions",
    CREATED: "Created",
    DESCRIPTION: "Description",
    KEY: "Key",
    NAME: "Name",
    UPDATED: "Updated",
  },
} as const;
