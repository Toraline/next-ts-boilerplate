import { API_URL } from "lib/constants";
import { User, UpdateUser } from "../types";
import { api } from "lib/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "lib/client/errors";
import { useMutation } from "global/hooks/useMutation";

const updateUser = ({
  userId,
  updates,
}: {
  userId: string;
  updates: UpdateUser;
}): Promise<User> => {
  const url = `${API_URL}/users/${userId}`;
  return api<User>(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, { userId: string; updates: UpdateUser }>({
    mutationFn: updateUser,
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(["users", variables.userId], updatedUser);
    },
  });
};
