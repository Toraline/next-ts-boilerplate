import { useListQuery } from "global/hooks/useListQuery";
import { api } from "lib/api";
import { API_URL } from "lib/constants";
import { listCategoriesQuerySchema } from "../schema";
import { ListCategoriesResponse, ListCategoriesQuery } from "../types";

/**
 * Fetches categories list from the API
 */
const fetchCategoriesList = async (
  query: Partial<ListCategoriesQuery> = {},
): Promise<ListCategoriesResponse> => {
  // Use Zod schema to provide defaults
  const validatedQuery = listCategoriesQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (validatedQuery.page) searchParams.set("page", validatedQuery.page.toString());
  if (validatedQuery.pageSize) searchParams.set("pageSize", validatedQuery.pageSize.toString());
  if (validatedQuery.search) searchParams.set("search", validatedQuery.search);
  if (validatedQuery.sortBy) searchParams.set("sortBy", validatedQuery.sortBy);
  if (validatedQuery.sortDir) searchParams.set("sortDir", validatedQuery.sortDir);

  const url = `${API_URL}/categories${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  return api<ListCategoriesResponse>(url);
};

/**
 * React Query hook for fetching categories list
 * Uses empty query object - defaults are handled by Zod schema
 */
export const useCategoriesList = () => {
  return useListQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesList({}), // Empty object, defaults from Zod schema
  });
};
