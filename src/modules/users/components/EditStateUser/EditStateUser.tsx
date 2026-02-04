"use client";

import { useQuery } from "@tanstack/react-query";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { useUser } from "modules/users/hooks/useUser";
import FormEditUser from "../FormEditUser/FormEditUser";
import { USER_CONSTANTS } from "modules/users/constants";

const authClient = createAuthClient();

export default function EditStateUser({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId);

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageUsersPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.USERS_MANAGE,
  );

  if (isLoading) {
    return <div>{USER_CONSTANTS.LOADING.LOADING_USER}</div>;
  }

  if (error) {
    return (
      <div>
        {USER_CONSTANTS.ERRORS.ERROR_LOADING_USER}:{error.message}
      </div>
    );
  }

  if (!user) {
    return <div>{USER_CONSTANTS.ERRORS.USER_NOT_FOUND}</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{user.name}</h1>
      </div>
      <FormEditUser initialState={user} userId={user.id} readOnly={!hasManageUsersPermission} />
    </div>
  );
}
