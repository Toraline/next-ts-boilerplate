import { API_URL } from "lib/constants";
import { CreatePermission, Permission } from "../types";
import { api } from "lib/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { ApiError } from "lib/client/errors";

const fetchCreatePermission = async (permissionData: CreatePermission): Promise<Permission> => {
  const url = `${API_URL}/permissions/`;
  return api<Permission>(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(permissionData),
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<Permission, ApiError, CreatePermission>({
    mutationFn: fetchCreatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
};
