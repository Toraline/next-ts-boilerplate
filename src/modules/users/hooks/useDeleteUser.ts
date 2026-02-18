import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { API_URL } from "lib/constants";
import { api } from "lib/http/api";

const deleteUser = async (userId: string): Promise<void> => {
  const url = `${API_URL}/users/${userId}`;
  await api<void>(url, { method: "DELETE" });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
