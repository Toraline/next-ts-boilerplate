import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

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

const isoDateTimeString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: VALIDATION_MESSAGES.INVALID_INPUT,
});

export const createRoleSchema = z.object({
  key: roleKeySchema,
  name: roleNameSchema,
  description: roleDescriptionSchema,
  permissionIds: z.array(permissionIdSchema).optional(),
});

export const listRolesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "key"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
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
  createdAt: isoDateTimeString,
  updatedAt: isoDateTimeString,
  permissions: z.array(
    z.object({
      id: permissionIdSchema,
      key: z.string().trim(),
      name: z.string().trim(),
      description: z.string().nullable(),
    }),
  ),
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
    permissionIds: z.array(permissionIdSchema).optional(),
  })
  .refine(
    (value) =>
      typeof value.name !== "undefined" ||
      typeof value.description !== "undefined" ||
      typeof value.permissionIds !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );
