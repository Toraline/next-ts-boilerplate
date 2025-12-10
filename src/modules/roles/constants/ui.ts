export const ROLES_UI = {
  EMPTY_STATES: {
    ROLE_NOT_FOUND: "Role not found",
    NO_ROLES_FOUND: "No roles found",
    TRY_ADJUSTING_FILTERS: "Try adjusting your search filters",
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

  LINKS: {
    CREATE_ROLE: "Create Role",
  },

  PAGINATION: {
    ROLES: "Roles",
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
