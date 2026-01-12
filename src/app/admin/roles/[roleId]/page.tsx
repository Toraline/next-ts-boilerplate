"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthGuard } from "global/components/AuthGuard";
import { NotFound } from "global/components/NotFound";
import EditStateRole from "modules/roles/components/EditStateRole/EditStateRole";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { GLOBAL_UI } from "global/constants";

const authClient = createAuthClient();

export default function Page({
  params,
}: {
  params: Promise<{ roleId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { roleId } = use(params);

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasViewRolesPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.ROLES_VIEW,
  );

  if (sessionQuery.isLoading || permissionsResponse === undefined) {
    return <div>{GLOBAL_UI.LOADING.DEFAULT}</div>;
  }

  if (!hasViewRolesPermission) {
    return <NotFound />;
  }

  return (
    <AuthGuard>
      <div className="flex-col flex pt-18 pl-41 pr-6 gap-15 max-w-xl">
        <EditStateRole roleId={roleId} />
      </div>
    </AuthGuard>
  );
}
