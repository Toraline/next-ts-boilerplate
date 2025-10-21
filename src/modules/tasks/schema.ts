import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

/** Fields Schemas */
export const idSchema = z.cuid();

export const descriptionSchema = z
  .string()
  .min(1, "Description is required")
  .max(1000, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)
  .trim();

export const checkedSchema = z.boolean();

export const categoryIdSchema = z.cuid();

/** Actions Schemas */
export const createTaskSchema = z.object({
  description: descriptionSchema,
  checked: checkedSchema.optional(),
  categoryId: categoryIdSchema,
});

/** Entities Schemas */
export const taskEntitySchema = z.object({
  id: idSchema,
  description: descriptionSchema,
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
