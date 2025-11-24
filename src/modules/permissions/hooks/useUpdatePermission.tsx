/**
 * Fetches the update of a permission from the API
 */

import { API_URL } from "lib/constants";
import { Permission, UpdatePermission } from "../types";
import { api } from "lib/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { ApiError } from "lib/client/errors";

const updatePermission = async ({
  permissionId,
  updates,
}: {
  permissionId: string;
  updates: UpdatePermission;
}): Promise<Permission> => {
  const url = `${API_URL}/permissions/${permissionId}`;
  return api<Permission>(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

/**
 * React Query mutation hook for updating a permission
 */

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<Permission, ApiError, { permissionId: string; updates: UpdatePermission }>({
    mutationFn: updatePermission,
    onSuccess: (updatedPermission, variables) => {
      queryClient.setQueryData(["permissions", variables.permissionId], updatedPermission);
    },
  });
};
