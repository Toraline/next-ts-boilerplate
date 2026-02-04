export const USER_CONSTANTS = {
  ERRORS: {
    CREATE_USER_ERRORS: "Fail to create user",
    UPDATE_USER_ERROR: "Fail to update user",
    ERROR_LOADING_USER: "Fail to load user",
    USER_NOT_FOUND: "User not found",
  },

  FORM_MESSAGES: {
    NO_CHANGES_DETECTED: "No changes detected. Please modify at least one field before saving.",
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
  },

  PLACEHOLDERS: {
    NAME: "Enter the user name",
    EMAIL: "Enter the user email",
    PROFILE_PICTURE: "Enter the url of the user picture",
    TENANT_ID: "Enter the tenant ID",
    STATUS: "Select the user status",
  },

  STATUS: {
    INVITED: "INVITED",
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
  },
} as const;
