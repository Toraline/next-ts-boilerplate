import { useMutation } from "global/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";
import { ApiError } from "lib/client/errors";
import { UpdateCategory, Category } from "../types";

/**
 * Fetches the update of a category from the API
 */
const updateCategory = async ({
  categoryIdOrSlug,
  updates,
}: {
  categoryIdOrSlug: string;
  updates: UpdateCategory;
}): Promise<Category> => {
  const url = `${API_URL}/categories/${categoryIdOrSlug}`;
  return api<Category>(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
};

/**
 * React Query mutation hook for updating a category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, ApiError, { categoryIdOrSlug: string; updates: UpdateCategory }>({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory, variables) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // Update the specific category cache
      queryClient.setQueryData(["categories", variables.categoryIdOrSlug], updatedCategory);

      // If the slug changed, update the new slug cache entry too
      if (updatedCategory.slug !== variables.categoryIdOrSlug) {
        queryClient.setQueryData(["categories", updatedCategory.slug], updatedCategory);
      }
    },
  });
};
