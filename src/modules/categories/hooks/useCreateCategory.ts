import { useMutation } from "global/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";
import { ApiError } from "lib/client/errors";
import { CreateCategory, Category } from "../types";

/**
 * Fetches the creation of a new category from the API
 */
const createCategory = async (categoryData: CreateCategory): Promise<Category> => {
  const url = `${API_URL}/categories`;
  return api<Category>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
};

/**
 * React Query mutation hook for creating a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, ApiError, CreateCategory>({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories list to show the new category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
