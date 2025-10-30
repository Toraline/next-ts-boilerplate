import { useMutation } from "global/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";
import { ApiError } from "lib/client/errors";
import { UpdateTask, Task } from "../types";

const updateTask = async ({
  taskById,
  updates,
}: {
  taskById: string;
  updates: UpdateTask;
}): Promise<Task> => {
  const url = `${API_URL}/tasks/${taskById}`;
  return api<Task>(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, { taskById: string; updates: UpdateTask }>({
    mutationFn: updateTask,
    onSuccess: (updatedTask, variables) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Update the specific task cache
      queryClient.setQueryData(["tasks", variables.taskById], updatedTask);
    },
  });
};
