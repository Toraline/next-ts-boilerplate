import { z } from "zod";
import {
  categoryPublicSchema,
  listCategoriesResponseSchema,
  listCategoriesQuerySchema,
  createCategorySchema,
  updateCategorySchema,
  categoriesListFiltersSchema,
} from "./schema";

// Export types inferred from Zod schemas
export type Category = z.infer<typeof categoryPublicSchema>;

export type ListCategoriesResponse = z.infer<typeof listCategoriesResponseSchema>;

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;

export type CategoriesListFilters = z.infer<typeof categoriesListFiltersSchema>;

export type CreateCategory = z.infer<typeof createCategorySchema>;

export type UpdateCategory = z.infer<typeof updateCategorySchema>;
