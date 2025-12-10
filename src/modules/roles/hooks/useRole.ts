import { API_URL } from "lib/constants";
import { Role } from "../types";
import { api } from "lib/http/api";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "lib/client/errors";

const fetchRole = async (roleId: string): Promise<Role> => {
  const url = `${API_URL}/roles/${roleId}`;

  return api<Role>(url);
};

export const useRole = (roleId: string) => {
  return useQuery({
    queryKey: ["roles", roleId],
    queryFn: () => fetchRole(roleId),
    enabled: !!roleId,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
