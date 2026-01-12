"use client";

import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "global/components/AuthGuard";
import { NotFound } from "global/components/NotFound";
import { FormNewRole } from "modules/roles/components/FormNewRole/FormNewRole";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { GLOBAL_UI } from "global/constants";

const authClient = createAuthClient();

export default function Page() {
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageRolesPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.ROLES_MANAGE,
  );

  if (sessionQuery.isLoading || permissionsResponse === undefined) {
    return <div>{GLOBAL_UI.LOADING.DEFAULT}</div>;
  }

  if (!hasManageRolesPermission) {
    return <NotFound />;
  }

  return (
    <AuthGuard>
      <div>
        <FormNewRole />
      </div>
    </AuthGuard>
  );
}
