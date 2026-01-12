/**
 * Permission keys used throughout the application
 * These are the source of truth for permission keys and are used in seed.ts and application code
 */
export const PERMISSION_KEYS = {
  USERS_MANAGE: "users.manage",
  USERS_INVITE: "users.invite",
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",
  PERMISSIONS_VIEW: "permissions.view",
  PERMISSIONS_MANAGE: "permissions.manage",
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_EDIT: "categories.edit",
  TASKS_VIEW: "tasks.view",
  TASKS_EDIT: "tasks.edit",
} as const;
