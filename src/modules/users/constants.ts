export const USER_CONSTANTS = {
  ERRORS: {
    CREATE_USER_ERRORS: "Fail to create user",
  },

  SUCCESSES: {
    CREATE_USER_SUCCESS: "User created succesfully",
  },

  LABELS: {
    NAME: "Name",
    EMAIL: "Email",
    PROFILE_PICTURE: "Profile picture url",
    TENANT_ID: "Tenant ID",
    STATUS: "Status",
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
