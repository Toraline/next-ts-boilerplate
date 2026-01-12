"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthGuard } from "global/components/AuthGuard";
import { NotFound } from "global/components/NotFound";
import { EditStatePermission } from "modules/permissions";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { GLOBAL_UI } from "global/constants";

const authClient = createAuthClient();

export default function Page({
  params,
}: {
  params: Promise<{ permissionId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { permissionId } = use(params);

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasViewPermissionsPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.PERMISSIONS_VIEW,
  );

  if (sessionQuery.isLoading || permissionsResponse === undefined) {
    return <div>{GLOBAL_UI.LOADING.DEFAULT}</div>;
  }

  if (!hasViewPermissionsPermission) {
    return <NotFound />;
  }

  return (
    <AuthGuard>
      <div className="flex-col flex pt-18 pl-41 pr-6 gap-15 max-w-xl">
        <EditStatePermission permissionId={permissionId} />
      </div>
    </AuthGuard>
  );
}
