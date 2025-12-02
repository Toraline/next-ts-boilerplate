import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { API_URL } from "lib/constants";
import { api } from "lib/http/api";

const deletePermission = async (permissionId: string): Promise<void> => {
  const url = `${API_URL}/permissions/${permissionId}`;
  await api<void>(url, { method: "DELETE" });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
};
