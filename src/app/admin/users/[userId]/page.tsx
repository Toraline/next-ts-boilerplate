"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthGuard } from "global/components/AuthGuard";
import { NotFound } from "global/components/NotFound";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { GLOBAL_UI } from "global/constants";
import EditStateUser from "modules/users/components/EditStateUser/EditStateUser";

const authClient = createAuthClient();

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = use(params);

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageUsersPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.USERS_MANAGE,
  );

  if (sessionQuery.isLoading || permissionsResponse === undefined) {
    return <div>{GLOBAL_UI.LOADING.DEFAULT}</div>;
  }

  if (!hasManageUsersPermission) {
    return <NotFound />;
  }

  return (
    <AuthGuard>
      <div className="flex-col flex pt-18 pl-41 pr-6 gap-15 max-w-xl">
        <EditStateUser userId={userId} />
      </div>
    </AuthGuard>
  );
}
