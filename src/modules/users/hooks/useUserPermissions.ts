import { useQuery } from "@tanstack/react-query";
import { api } from "lib/http/api";
import { API_URL } from "lib/constants";
import { listUserPermissionsResponseSchema } from "../schema";
import { z } from "zod";

type ListUserPermissionsResponse = z.infer<typeof listUserPermissionsResponseSchema>;

const fetchUserPermissions = async (userId: string): Promise<ListUserPermissionsResponse> => {
  const url = `${API_URL}/users/${userId}/permissions`;
  return api<ListUserPermissionsResponse>(url);
};

export const useUserPermissions = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["users", userId, "permissions"],
    queryFn: () => fetchUserPermissions(userId!),
    enabled: !!userId,
  });
};
