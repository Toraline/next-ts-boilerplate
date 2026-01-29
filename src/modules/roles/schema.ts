import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";
import { isoDateTimeStringSchema } from "lib/validation/datetime";
import { paginationSchema, sortDirectionSchema } from "lib/validation/pagination";

export const roleIdSchema = z.cuid();
export const roleKeySchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(120, VALIDATION_MESSAGES.NAME_TOO_LONG);
export const roleNameSchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(120, VALIDATION_MESSAGES.NAME_TOO_LONG);
export const roleDescriptionSchema = z
  .string()
  .trim()
  .max(255, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)
  .nullable()
  .optional();

export const permissionIdSchema = z.cuid();
export const permissionKeySchema = z.string().trim();

export const createRoleSchema = z.object({
  key: roleKeySchema,
  name: roleNameSchema,
  description: roleDescriptionSchema,
  permissionKeys: z.array(z.string()).optional(),
});

export const listRolesQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "key"]).default("createdAt"),
  sortDir: sortDirectionSchema.default("desc"),
});

export const roleEntitySchema = z.object({
  id: roleIdSchema,
  key: roleKeySchema,
  name: roleNameSchema,
  description: roleDescriptionSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const permissionEntitySchema = z.object({
  id: permissionIdSchema,
  key: z.string().trim(),
  name: z.string().trim(),
  description: z.string().nullable(),
});

export const rolePublicSchema = z.object({
  id: roleIdSchema,
  key: roleKeySchema,
  name: roleNameSchema,
  description: roleDescriptionSchema,
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
  permissions: z.array(z.string()).optional(),
});

export const listRolesResponseSchema = z.object({
  items: z.array(rolePublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export const updateRoleSchema = z
  .object({
    name: roleNameSchema.optional(),
    description: roleDescriptionSchema,
    key: roleKeySchema.optional(),
    permissionKeys: z.array(permissionKeySchema).optional(),
  })
  .refine(
    (value) =>
      typeof value.name !== "undefined" ||
      typeof value.description !== "undefined" ||
      typeof value.key !== "undefined" ||
      typeof value.permissionKeys !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );

export const assignRolePermissionSchema = z.object({
  permissionKey: permissionKeySchema,
});

export const rolePermissionEntitySchema = z.object({
  roleId: roleIdSchema,
  permissionKey: permissionKeySchema,
  createdAt: z.date(),
});

export const rolePermissionPublicSchema = z.object({
  roleId: roleIdSchema,
  permissionKey: permissionKeySchema,
  createdAt: isoDateTimeStringSchema,
});

export const rolePermissionAssignmentSchema = z.array(permissionKeySchema);

export const listRolePermissionsResponseSchema = z.object({
  items: z.array(rolePermissionAssignmentSchema),
});

export const rolesListFiltersSchema = listRolesQuerySchema
  .pick({
    search: true,
    sortBy: true,
    sortDir: true,
  })
  .partial();
