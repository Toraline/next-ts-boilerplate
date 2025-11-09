import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

export const permissionIdSchema = z.cuid();
export const permissionKeySchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(120, VALIDATION_MESSAGES.NAME_TOO_LONG);
export const permissionNameSchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(120, VALIDATION_MESSAGES.NAME_TOO_LONG);
export const permissionDescriptionSchema = z
  .string()
  .trim()
  .max(255, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)
  .nullable()
  .optional();

const isoDateTimeString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: VALIDATION_MESSAGES.INVALID_INPUT,
});

export const createPermissionSchema = z.object({
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
});

export const listPermissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "key"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const permissionEntitySchema = z.object({
  id: permissionIdSchema,
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const permissionPublicSchema = z.object({
  id: permissionIdSchema,
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  createdAt: isoDateTimeString,
  updatedAt: isoDateTimeString,
});

export const listPermissionsResponseSchema = z.object({
  items: z.array(permissionPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export const updatePermissionSchema = z
  .object({
    name: permissionNameSchema.optional(),
    description: permissionDescriptionSchema,
  })
  .refine(
    (value) => typeof value.name !== "undefined" || typeof value.description !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );
