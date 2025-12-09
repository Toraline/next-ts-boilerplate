import { API_URL } from "lib/constants";
import { listRolesQuerySchema } from "../schema";
import { ListRolesQuery, ListRolesResponse } from "../types";
import { api } from "lib/http/api";
import { useListQuery } from "global/hooks/useListQuery";

async function fetchRolesList(query: Partial<ListRolesQuery> = {}): Promise<ListRolesResponse> {
  const validatedQuery = listRolesQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (validatedQuery.page) searchParams.set("page", validatedQuery.page.toString());
  if (validatedQuery.pageSize) searchParams.set("pageSize", validatedQuery.pageSize.toString());
  if (validatedQuery.search) searchParams.set("search", validatedQuery.search);
  if (validatedQuery.sortBy) searchParams.set("sortBy", validatedQuery.sortBy);
  if (validatedQuery.sortDir) searchParams.set("sortDir", validatedQuery.sortDir);

  const url = `${API_URL}/roles${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return api<ListRolesResponse>(url);
}

export const useRolesList = (query: Partial<ListRolesQuery> = {}) => {
  return useListQuery({
    queryKey: ["roles", query],
    queryFn: () => fetchRolesList(query),
  });
};
