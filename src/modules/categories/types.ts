import { z } from "zod";
import {
  categoryPublicSchema,
  listCategoriesResponseSchema,
  listCategoriesQuerySchema,
} from "./schema";

// Export types inferred from Zod schemas
export type Category = z.infer<typeof categoryPublicSchema>;

export type ListCategoriesResponse = z.infer<typeof listCategoriesResponseSchema>;

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
