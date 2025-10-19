import { useMutation } from "global/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "lib/api";
import { API_URL } from "lib/constants";

/**
 * Fetches the deletion of a category from the API
 */
const deleteCategory = async (categoryIdOrSlug: string): Promise<void> => {
  const url = `${API_URL}/categories/${categoryIdOrSlug}`;
  await api<void>(url, {
    method: "DELETE",
  });
};

/**
 * React Query mutation hook for deleting a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate and refetch categories list to remove the deleted category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
