import { API_URL } from "lib/constants";
import { CreateUser, User } from "../types";
import { api } from "lib/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "global/hooks/useMutation";
import { ApiError } from "lib/client/errors";

const fetchCreateUser = async (userData: CreateUser): Promise<User> => {
  const url = `${API_URL}/users/`;
  return api<User>(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, CreateUser>({
    mutationFn: fetchCreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
