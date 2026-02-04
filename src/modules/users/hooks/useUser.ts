import { API_URL } from "lib/constants";
import { User } from "../types";
import { api } from "lib/http/api";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "lib/client/errors";

const fetchUser = async (userId: string): Promise<User> => {
  const url = `${API_URL}/users/${userId}`;

  return api<User>(url);
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
