import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";

const deleteTask = async (taskId: string): Promise<void> => {
  const url = `${API_URL}/tasks/${taskId}`;
  await api<void>(url, {
    method: "DELETE",
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
