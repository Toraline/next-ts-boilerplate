import { z } from "zod";

export const idSchema = z.string().cuid();

export const slugSchema = z
  .string()
  .min(3, "Slug must have at least 3 characters")
  .max(60, "Slug must be at most 60 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes");

const nameSchema = z.string().min(2, "Name too short").max(80, "Name too long").trim();

export const descriptionSchema = z.string().max(500, "Max 500 chars").optional();

export const createCategorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
});

export type Category = z.infer<typeof createCategorySchema>;
