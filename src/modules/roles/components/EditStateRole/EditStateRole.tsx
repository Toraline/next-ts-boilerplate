"use client";

import { useQuery } from "@tanstack/react-query";
import { ROLES_UI } from "modules/roles/constants/ui";
import { useRole } from "modules/roles/hooks/useRole";
import FormEditRole from "../FormEditRole.tsx/FormEditRole";
import { ROLE_ERRORS } from "modules/roles/constants/errors";
import { useDeleteRole } from "modules/roles/hooks/useDeleteRole";
import { toast } from "sonner";
import { ROLE_SUCCESSES } from "modules/roles/constants";
import { GLOBAL_UI } from "global/constants";
import { Button } from "global/ui";
import { useRouter } from "next/navigation";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";

const authClient = createAuthClient();

export default function EditStateRole({ roleId }: { roleId: string }) {
  const { data: role, isLoading, error } = useRole(roleId);

  const deleteRoleMutation = useDeleteRole();
  const router = useRouter();

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageRolesPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.ROLES_MANAGE,
  );

  const onDelete = async () => {
    if (!role || !confirm(ROLES_UI.CONFIRMATIONS.DELETE_ROLE)) return;

    deleteRoleMutation.mutate(role.id, {
      onSuccess: () => {
        toast.success(ROLE_SUCCESSES.DELETE_ROLE_SUCCESS);
        router.push("/admin/roles");
      },
      onError: () => {
        toast.error(ROLE_ERRORS.DELETE_ROLE_ERROR);
      },
    });
  };

  if (isLoading) {
    return <div>{ROLES_UI.LOADING.LOADING_ROLE}</div>;
  }

  if (error) {
    return (
      <div>
        {ROLE_ERRORS.ERROR_LOADING_ROLE}:{error.message}
      </div>
    );
  }

  if (!role) {
    return <div>{ROLES_UI.EMPTY_STATES.ROLE_NOT_FOUND}</div>;
  }
  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{role.name}</h1>
      </div>
      <FormEditRole initialState={role} roleId={role.id} readOnly={!hasManageRolesPermission} />
      {hasManageRolesPermission && (
        <Button
          id="delete-button"
          type="button"
          onClick={onDelete}
          disabled={deleteRoleMutation.isPending}
        >
          {deleteRoleMutation.isPending ? GLOBAL_UI.BUTTONS.DELETING : GLOBAL_UI.BUTTONS.DELETE}
        </Button>
      )}
    </div>
  );
}
