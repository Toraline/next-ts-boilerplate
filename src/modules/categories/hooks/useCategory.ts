import { useQuery } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";
import { ApiError } from "lib/client/errors";
import { Category } from "../types";

/**
 * Fetches a single category from the API
 */
const fetchCategory = async (categoryIdOrSlug: string): Promise<Category> => {
  const url = `${API_URL}/categories/${categoryIdOrSlug}`;
  return api<Category>(url);
};

/**
 * React Query hook for fetching a single category
 */
export const useCategory = (categoryIdOrSlug: string) => {
  return useQuery({
    queryKey: ["categories", categoryIdOrSlug],
    queryFn: () => fetchCategory(categoryIdOrSlug),
    enabled: !!categoryIdOrSlug, // Only run the query if categoryIdOrSlug is provided
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });
};
