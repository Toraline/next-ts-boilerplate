import { API_URL } from "lib/constants";
import { listUsersQuerySchema } from "../schema";
import { api } from "lib/http/api";
import { useListQuery } from "global/hooks/useListQuery";
import { ListUsersQuery, ListUsersResponse } from "../types";

async function fetchUsersList(query: Partial<ListUsersQuery> = {}): Promise<ListUsersResponse> {
  const validatedQuery = listUsersQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (validatedQuery.page) searchParams.set("page", validatedQuery.page.toString());
  if (validatedQuery.pageSize) searchParams.set("pageSize", validatedQuery.pageSize.toString());
  if (validatedQuery.search) searchParams.set("search", validatedQuery.search);
  if (validatedQuery.sortBy) searchParams.set("sortBy", validatedQuery.sortBy);
  if (validatedQuery.sortDir) searchParams.set("sortDir", validatedQuery.sortDir);

  const url = `${API_URL}/users${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return api<ListUsersResponse>(url);
}

export const useUsersList = (query: Partial<ListUsersQuery> = {}) => {
  return useListQuery({
    queryKey: ["users", query],
    queryFn: () => fetchUsersList(query),
  });
};
