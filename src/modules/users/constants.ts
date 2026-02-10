export const USER_CONSTANTS = {
  ERRORS: {
    CREATE_USER_ERRORS: "Fail to create user",
    UPDATE_USER_ERROR: "Fail to update user",
    ERROR_LOADING_USER: "Fail to load user",
    USER_NOT_FOUND: "User not found",
  },

  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
    LOADING_USERS: "Fail to load users",
  },

  EMPTY_STATES: {
    USER_NOT_FOUND: "User not found",
    NO_USERS_FOUND: "No users found",
    TRY_ADJUSTING_FILTERS: "Try adjusting your search filters",
  },

  SUCCESSES: {
    CREATE_USER_SUCCESS: "User created succesfully",
    UPDATE_USER_SUCCESS: "User updated succesfully",
  },

  LABELS: {
    NAME: "Name",
    EMAIL: "Email",
    PROFILE_PICTURE: "Profile picture url",
    TENANT_ID: "Tenant ID",
    STATUS: "Status",
  },

  LOADING: {
    LOADING_USER: "Loading user...",
    LOADING_USERS: "Loading users...",
  },

  LINKS: {
    CREATE_USER: "Create User",
  },

  PAGINATION: {
    USERS: "users",
  },

  PLACEHOLDERS: {
    NAME: "Enter the user name",
    EMAIL: "Enter the user email",
    PROFILE_PICTURE: "Enter the url of the user picture",
    TENANT_ID: "Enter the tenant ID",
    STATUS: "Select the user status",
    SEARCH: "Search",
  },

  SORT_OPTIONS: {
    CREATED_AT: "Created Date",
    LAST_LOGIN_AT: "Last Login At",
    EMAIL: "Email",
    NAME: "Name",
    UPDATED_AT: "Updated At",
  },

  STATUS: {
    INVITED: "INVITED",
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
  },

  TABLE_COLUMNS: {
    ACTIONS: "Actions",
    NAME: "Name",
    EMAIL: "Email",
    STATUS: "Status",
    CREATED_AT: "Created",
    DELETED_AT: "Deleted",
    UPDATED_AT: "Updated",
    LAST_LOGIN_AT: "Last Login",
  },
} as const;
