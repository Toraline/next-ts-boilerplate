/**
 * Role-specific UI text constants
 * All text that appears in role-related components
 */

export const ROLES_UI = {
  EMPTY_STATES: {
    ROLE_NOT_FOUND: "Role not found",
    NO_ROLES_FOUND: "No roles found",
    TRY_ADJUSTING_FILTERS: "Try adjusting your search filters",
  },

  //Confirmations
  CONFIRMATIONS: {
    DELETE_ROLE: "Are you sure you want to delete this role?",
  },
  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
  },

  LABELS: {
    NAME: "Name",
    KEY: "Key",
    DESCRIPTION: "Description",
  },

  LOADING: {
    LOADING_ROLE: "Loading role...",
    LOADING_ROLES: "Loading roles...",
  },

  PLACEHOLDERS: {
    NAME: "Enter the role name",
    KEY: "Enter the role key",
    DESCRIPTION: "Enter the role description",
    SEARCH: "Search by roles",
  },

  //Headers and Titles
  HEADERS: {
    ROLES: "Roles",
    NEW_ROLE: "New Role",
  },

  //Links
  LINKS: {
    CREATE_ROLE: "Create Role",
  },

  PAGINATION: {
    ROLES: "roles",
  },

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
