import { ListTasksQuery, ListTasksResponse } from "../types";
import { api } from "lib/http/api";
import { useListQuery } from "global/hooks/useListQuery";
import { API_URL } from "lib/constants";
import { listTasksQuerySchema } from "../schema";

async function fetchTasksList(query: Partial<ListTasksQuery> = {}): Promise<ListTasksResponse> {
  const validatedQuery = listTasksQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (validatedQuery.checked !== undefined)
    searchParams.set("checked", validatedQuery.checked.toString());
  if (validatedQuery.categoryId) searchParams.set("categoryId", validatedQuery.categoryId);

  const url = `${API_URL}/tasks?${searchParams.toString()}`;
  return api<ListTasksResponse>(url);
}

export const useTasksList = (query: Partial<ListTasksQuery> = {}) => {
  return useListQuery({
    queryKey: ["tasks", query],
    queryFn: () => fetchTasksList(query),
  });
};
