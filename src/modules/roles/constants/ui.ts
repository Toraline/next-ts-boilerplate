/**
 * Role-specific UI text constants
 * All text that appears in role-related components
 */

export const ROLES_UI = {
  //Confirmations
  CONFIRMATIONS: {
    DELETE_ROLE: "Are you sure you want to delete this role?",
  },

  //Empty States
  EMPTY_STATES: {
    ROLE_NOT_FOUND: "Role not found",
    NO_ROLES_FOUND: "No roles found",
    TRY_ADJUSTING_FILTERS: "Try adjusting your search or filters",
  },

  //Form Messages
  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
  },

  //Headers and Titles
  HEADERS: {
    ROLES: "Roles",
    NEW_ROLE: "New Role",
  },

  //Labels
  LABELS: {
    KEY: "Key",
    NAME: "Name",
    DESCRIPTION: "Description",
  },

  //Links
  LINKS: {
    CREATE_ROLE: "Create Role",
  },

  //Loading States
  LOADING: {
    LOADING_ROLES: "Loading roles...",
    LOADING_ROLE: "Loading role...",
  },

  // Pagination
  PAGINATION: {
    ROLES: "roles",
  },

  //Placeholders
  PLACEHOLDERS: {
    KEY: "Enter the role key",
    NAME: "Enter the role name",
    DESCRIPTION: "Enter the role description",
    SEARCH: "Search by key/name/description",
  },

  // Sort Options
  SORT_OPTIONS: {
    CREATED_AT: "Created Date",
    KEY: "Key",
    NAME: "Name",
    UPDATED_AT: "Updated At",
  },

  TABLE_COLUMNS: {
    ACTIONS: "Actions",
    CREATED: "Created",
    DESCRIPTION: "Description",
    KEY: "Key",
    NAME: "Name",
    UPDATED: "Updated",
  },
} as const;
