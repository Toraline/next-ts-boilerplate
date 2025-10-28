import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

/** Fields Schemas */
export const idSchema = z.cuid();

export const descriptionSchema = z
  .string()
  .max(1000, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)
  .trim()
  .optional();

export const checkedSchema = z.boolean();

export const categoryIdSchema = z.cuid();

/** Actions Schemas */
export const createTaskSchema = z.object({
  description: descriptionSchema,
  checked: checkedSchema.optional(),
  categoryId: categoryIdSchema,
});

export const updateTaskSchema = z
  .object({
    description: descriptionSchema.optional(),
    checked: checkedSchema.optional(),
  })
  .refine((v) => typeof v.description !== "undefined" || typeof v.checked !== "undefined", {
    message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED,
  });

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  checked: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "description"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

/** Entities Schemas */
export const taskEntitySchema = z.object({
  id: idSchema,
  description: descriptionSchema.optional(),
  checked: checkedSchema,
  categoryId: categoryIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Public API Schemas (FE receives ISO strings) */
export const taskPublicSchema = z.object({
  id: idSchema,
  description: descriptionSchema,
  checked: checkedSchema,
  categoryId: categoryIdSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const listTasksResponseSchema = z.object({
  items: z.array(taskPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});
