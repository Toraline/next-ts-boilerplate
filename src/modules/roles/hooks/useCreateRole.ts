import { API_URL } from "lib/constants";
import { CreateRole, Role } from "../types";
import { api } from "lib/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { ApiError } from "lib/client/errors";

const fetchCreateRole = async (roleData: CreateRole): Promise<Role> => {
  const url = `${API_URL}/roles/`;
  return api<Role>(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(roleData),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, ApiError, CreateRole>({
    mutationFn: fetchCreateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};
