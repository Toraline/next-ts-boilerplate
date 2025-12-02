import { API_URL } from "lib/constants";
import { listPermissionsQuerySchema } from "../schema";
import { ListPermissionsQuery, ListPermissionsResponse } from "../server/types";
import { api } from "lib/http/api";
import { useListQuery } from "global/hooks/useListQuery";

async function fetchPermissionsList(
  query: Partial<ListPermissionsQuery> = {},
): Promise<ListPermissionsResponse> {
  const validatedQuery = listPermissionsQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (validatedQuery.page) searchParams.set("page", validatedQuery.page.toString());
  if (validatedQuery.pageSize) searchParams.set("pageSize", validatedQuery.pageSize.toString());
  if (validatedQuery.search) searchParams.set("search", validatedQuery.search);
  if (validatedQuery.sortBy) searchParams.set("sortBy", validatedQuery.sortBy);
  if (validatedQuery.sortDir) searchParams.set("sortDir", validatedQuery.sortDir);

  const url = `${API_URL}/permissions${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return api<ListPermissionsResponse>(url);
}

export const usePermissionsList = (query: Partial<ListPermissionsQuery> = {}) => {
  return useListQuery({
    queryKey: ["permissions", query],
    queryFn: () => fetchPermissionsList(query),
  });
};
