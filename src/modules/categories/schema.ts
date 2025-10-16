import { z } from "zod";

export const isCuid = (value: string) => z.cuid().safeParse(value).success;

/** Fields Schemas */
export const idSchema = z.cuid();

export const slugSchema = z
  .string()
  .min(3, "Slug must have at least 3 characters")
  .max(60, "Slug must be at most 60 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes")
  .refine((value) => !isCuid(value), "Slug cannot be a cuid");

export const idOrSlugSchema = z.union([idSchema, slugSchema]);

export const nameSchema = z.string().min(2, "Name too short").max(80, "Name too long").trim();

export const descriptionSchema = z.string().max(500, "Max 500 chars").optional();

/** Actions Schemas */
export const createCategorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
});

export const updateCategorySchema = z
  .object({
    name: z.string().min(2).max(80).trim().optional(),
    slug: slugSchema.optional(),
    description: z.string().max(500).optional(),
  })
  .refine(
    (v) =>
      typeof v.name !== "undefined" ||
      typeof v.slug !== "undefined" ||
      typeof v.description !== "undefined",
    { message: "At least one field to update is required" },
  );

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "updatedAt", "slug"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

/** Entities Schemas */
export const categoryEntitySchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Public API Schemas (FE receives ISO strings) */
export const categoryPublicSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const listCategoriesResponseSchema = z.object({
  items: z.array(categoryPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export type Category = z.infer<typeof createCategorySchema>;
