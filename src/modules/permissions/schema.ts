import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";
import { isoDateTimeStringSchema } from "lib/validation/datetime";
import { paginationSchema, sortDirectionSchema } from "lib/validation/pagination";

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
export const permissionIsRequiredSchema = z.boolean().optional();

export const createPermissionSchema = z.object({
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  isRequired: permissionIsRequiredSchema,
});

export const listPermissionsQuerySchema = paginationSchema.extend({
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "key", "isRequired"]).default("createdAt"),
  sortDir: sortDirectionSchema.default("desc"),
});

export const permissionEntitySchema = z.object({
  id: permissionIdSchema,
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  isRequired: permissionIsRequiredSchema,
});

export const permissionPublicSchema = z.object({
  id: permissionIdSchema,
  key: permissionKeySchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
  isRequired: permissionIsRequiredSchema,
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
    isRequired: permissionIsRequiredSchema,
    key: permissionKeySchema.optional(),
  })
  .refine(
    (value) =>
      typeof value.name !== "undefined" ||
      typeof value.description !== "undefined" ||
      typeof value.key !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );

export const permissionsListFiltersSchema = listPermissionsQuerySchema
  .pick({
    search: true,
    sortBy: true,
    sortDir: true,
  })
  .partial();
