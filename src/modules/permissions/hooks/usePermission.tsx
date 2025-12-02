/**
 * Fetches a single permission from the API
 */

import { API_URL } from "lib/constants";
import { Permission } from "../types";
import { api } from "lib/http/api";
import { ApiError } from "lib/client/errors";
import { useQuery } from "@tanstack/react-query";

const fetchPermission = async (permissionId: string): Promise<Permission> => {
  const url = `${API_URL}/permissions/${permissionId}`;
  return api<Permission>(url);
};

/**
 * React Query hook for fetching a single permission
 */

export const usePermission = (permissionId: string) => {
  return useQuery({
    queryKey: ["permissions", permissionId],
    queryFn: () => fetchPermission(permissionId),
    enabled: !!permissionId,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
