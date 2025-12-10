"use client";

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

export default function EditStateRole({ roleId }: { roleId: string }) {
  const { data: role, isLoading, error } = useRole(roleId);

  const deleteRoleMutation = useDeleteRole();
  const router = useRouter();

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
      <FormEditRole initialState={role} roleId={roleId} />
      <Button
        id="delete-button"
        type="button"
        onClick={onDelete}
        disabled={deleteRoleMutation.isPending}
      >
        Delete
        {deleteRoleMutation.isPending && GLOBAL_UI.BUTTONS.DELETING}
      </Button>
    </div>
  );
}
