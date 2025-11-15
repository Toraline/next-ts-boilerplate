import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";
import { userIdSchema } from "modules/users/schema";

export const isCuid = (value: string) => z.cuid().safeParse(value).success;

/** Fields Schemas */
export const idSchema = z.cuid();

export const slugSchema = z
  .string()
  .min(3, VALIDATION_MESSAGES.SLUG_MIN_LENGTH)
  .max(60, VALIDATION_MESSAGES.SLUG_MAX_LENGTH)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, VALIDATION_MESSAGES.SLUG_FORMAT)
  .refine((value) => !isCuid(value), VALIDATION_MESSAGES.SLUG_CUID_ERROR);

export const idOrSlugSchema = z.union([idSchema, slugSchema]);

export const nameSchema = z
  .string()
  .min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(80, VALIDATION_MESSAGES.NAME_TOO_LONG)
  .trim();

export const descriptionSchema = z
  .string()
  .max(500, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)
  .optional();

/** Actions Schemas */
export const createCategorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
});

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT)
      .max(80, VALIDATION_MESSAGES.NAME_TOO_LONG)
      .trim()
      .optional(),
    slug: slugSchema.optional(),
    description: z.string().max(500, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH).optional(),
  })
  .refine(
    (v) =>
      typeof v.name !== "undefined" ||
      typeof v.slug !== "undefined" ||
      typeof v.description !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "updatedAt", "slug"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

// Extract only the filter fields for form validation (not pagination)
export const categoriesListFiltersSchema = listCategoriesQuerySchema
  .pick({
    search: true,
    sortBy: true,
    sortDir: true,
  })
  .partial();

/** Entities Schemas */
export const categoryEntitySchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().nullable().optional(),
  userId: userIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Public API Schemas (FE receives ISO strings) */
export const categoryPublicSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().nullable().optional(),
  userId: userIdSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const listCategoriesResponseSchema = z.object({
  items: z.array(categoryPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});
