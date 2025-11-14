import { useQuery } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";
import { ApiError } from "lib/client/errors";
import { Task } from "../types";

const fetchTask = async (taskId: string): Promise<Task> => {
  const url = `${API_URL}/tasks/${taskId}`;
  return api<Task>(url);
};

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => fetchTask(taskId),
    enabled: !!taskId, // Only run the query if taskId is provided
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
