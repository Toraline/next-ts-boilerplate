import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";
import { isoDateTimeStringSchema } from "lib/validation/datetime";
import { paginationSchema, sortDirectionSchema } from "lib/validation/pagination";

export const userStatusSchema = z.enum(["ACTIVE", "INVITED", "SUSPENDED"]);

export const userIdSchema = z.cuid();

export const emailSchema = z.string().trim().email();

export const roleIdSchema = z.cuid();
export const roleKeySchema = z.string().trim().min(1).max(120);
export const roleNameSchema = z.string().trim().min(1).max(120);
export const roleDescriptionSchema = z.string().trim().max(255).nullable().optional();

export const permissionIdSchema = z.cuid();
export const permissionKeySchema = z.string().trim().min(1).max(120);
export const permissionNameSchema = z.string().trim().min(1).max(120);
export const permissionDescriptionSchema = z.string().trim().max(255).nullable().optional();

export const nameSchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(120, VALIDATION_MESSAGES.NAME_TOO_LONG);

export const avatarUrlSchema = z.string().trim().optional();

export const tenantIdSchema = z.string().trim().min(1).max(120);

export const clerkUserIdSchema = z.string().trim().min(1).max(120);

const tenantIdOptionalSchema = tenantIdSchema.optional();
const clerkUserIdOptionalSchema = clerkUserIdSchema.optional();

export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  avatarUrl: avatarUrlSchema.optional(),
  // BO-230 remove the optional from the status when adding Clerk
  status: userStatusSchema.optional(),
  tenantId: tenantIdOptionalSchema,
  clerkUserId: clerkUserIdOptionalSchema,
});

const nullableDateSchema = z.union([z.coerce.date(), z.null()]).optional();

const optionalUrlOrNullSchema = z.union([avatarUrlSchema, z.null()]).optional();

const optionalTenantIdOrNullSchema = z.union([tenantIdSchema, z.null()]).optional();
const optionalClerkUserIdOrNullSchema = z.union([clerkUserIdSchema, z.null()]).optional();

export const updateUserSchema = z
  .object({
    email: emailSchema.optional(),
    name: nameSchema.optional(),
    avatarUrl: optionalUrlOrNullSchema,
    status: userStatusSchema.optional(),
    tenantId: optionalTenantIdOrNullSchema,
    clerkUserId: optionalClerkUserIdOrNullSchema,
    lastLoginAt: nullableDateSchema,
    deletedAt: nullableDateSchema,
  })
  .refine(
    (value) =>
      typeof value.name !== "undefined" ||
      typeof value.avatarUrl !== "undefined" ||
      typeof value.status !== "undefined" ||
      typeof value.tenantId !== "undefined" ||
      typeof value.clerkUserId !== "undefined" ||
      typeof value.lastLoginAt !== "undefined" ||
      typeof value.deletedAt !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );

export const listUsersQuerySchema = paginationSchema.extend({
  status: userStatusSchema.optional(),
  tenantId: tenantIdSchema.optional(),
  email: emailSchema.optional(),
  clerkUserId: clerkUserIdSchema.optional(),
  includeDeleted: z.coerce.boolean().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "email", "lastLoginAt"]).default("createdAt"),
  sortDir: sortDirectionSchema.default("desc"),
});

export const userEntitySchema = z.object({
  id: userIdSchema,
  email: emailSchema,
  name: nameSchema,
  avatarUrl: avatarUrlSchema.nullable(),
  status: userStatusSchema,
  lastLoginAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  clerkUserId: clerkUserIdSchema.nullable(),
  tenantId: tenantIdSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userPublicSchema = z.object({
  id: userIdSchema,
  email: emailSchema,
  name: nameSchema,
  avatarUrl: avatarUrlSchema.nullable(),
  status: userStatusSchema,
  lastLoginAt: isoDateTimeStringSchema.nullable(),
  deletedAt: isoDateTimeStringSchema.nullable(),
  clerkUserId: clerkUserIdSchema.nullable(),
  tenantId: tenantIdSchema.nullable(),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
});

export const listUsersResponseSchema = z.object({
  items: z.array(userPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export const assignUserRoleSchema = z.object({
  roleId: roleIdSchema,
});

export const userRoleEntitySchema = z.object({
  userId: userIdSchema,
  roleId: roleIdSchema,
  createdAt: z.date(),
});

export const userRolePublicSchema = z.object({
  userId: userIdSchema,
  roleId: roleIdSchema,
  createdAt: isoDateTimeStringSchema,
});

export const roleWithPermissionsSchema = z.object({
  id: roleIdSchema,
  key: roleKeySchema,
  name: roleNameSchema,
  description: roleDescriptionSchema,
  permissions: z.array(
    z.object({
      id: permissionIdSchema,
      key: permissionKeySchema,
      name: permissionNameSchema,
      description: permissionDescriptionSchema,
    }),
  ),
  assignedAt: isoDateTimeStringSchema,
});

export const listUserRolesResponseSchema = z.object({
  items: z.array(roleWithPermissionsSchema),
});

export const assignUserPermissionSchema = z.object({
  permissionId: permissionIdSchema,
});

export const userPermissionEntitySchema = z.object({
  userId: userIdSchema,
  permissionId: permissionIdSchema,
  createdAt: z.date(),
});

export const userPermissionPublicSchema = z.object({
  userId: userIdSchema,
  permissionId: permissionIdSchema,
  createdAt: isoDateTimeStringSchema,
});

export const permissionWithAssignmentSchema = z.object({
  id: permissionIdSchema,
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  assignedAt: isoDateTimeStringSchema,
});

export const listUserPermissionsResponseSchema = z.object({
  items: z.array(permissionWithAssignmentSchema),
});
