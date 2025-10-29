import { API_URL } from "lib/constants";
import { CreateTask, Task } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { api } from "lib/http/api";
import { ApiError } from "lib/client/errors";

const fetchCreateTask = async (taskData: CreateTask): Promise<Task> => {
  const url = `${API_URL}/tasks`;
  return api<Task>(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, CreateTask>({
    mutationFn: fetchCreateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};
