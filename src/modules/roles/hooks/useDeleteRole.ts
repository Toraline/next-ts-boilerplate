import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { API_URL } from "lib/constants";
import { api } from "lib/http/api";

const deleteRole = async (roleId: string): Promise<void> => {
  const url = `${API_URL}/roles/${roleId}`;
  await api<void>(url, { method: "DELETE" });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};
