import { API_URL } from "lib/constants";
import { Role, UpdateRole } from "../types";
import { api } from "lib/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "lib/client/errors";
import { useMutation } from "global/hooks/useMutation";

const updateRole = ({
  roleId,
  updates,
}: {
  roleId: string;
  updates: UpdateRole;
}): Promise<Role> => {
  const url = `${API_URL}/roles/${roleId}`;
  return api<Role>(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, ApiError, { roleId: string; updates: UpdateRole }>({
    mutationFn: updateRole,
    onSuccess: (updatedRole, variables) => {
      queryClient.setQueryData(["roles", variables.roleId], updatedRole);
    },
  });
};
