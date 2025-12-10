"use client";

import { usePermission } from "modules/permissions/hooks/usePermission";
import { FormEditPermission } from "../FormEditPermission/FormEditPermission";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";
import { PERMISSION_ERRORS } from "modules/permissions/constants/errors";
import { useDeletePermission } from "modules/permissions/hooks/useDeletePermission";
import { toast } from "sonner";
import { PERMISSION_SUCCESSES } from "modules/permissions/constants";
import { useRouter } from "next/navigation";
import { Button } from "global/ui";
import { GLOBAL_UI } from "global/constants";

export default function EditStatePermission({ permissionId }: { permissionId: string }) {
  const router = useRouter();
  const { data: permission, isLoading, error } = usePermission(permissionId);
  const deletePermissionMutation = useDeletePermission();

  if (isLoading) {
    return <div className="permission-content">{PERMISSIONS_UI.LOADING.LOADING_PERMISSION}</div>;
  }

  if (error) {
    return (
      <div className="permission-content">
        {PERMISSION_ERRORS.ERROR_LOADING_PERMISSION}: {error.message}
      </div>
    );
  }

  if (!permission) {
    return (
      <div className="permission-content">{PERMISSIONS_UI.EMPTY_STATES.PERMISSION_NOT_FOUND}</div>
    );
  }

  const onDelete = async () => {
    if (!permission || !confirm(PERMISSIONS_UI.CONFIRMATIONS.DELETE_PERMISSION)) return;

    deletePermissionMutation.mutate(permission.id, {
      onSuccess: () => {
        router.push("/admin/permissions");
        toast.success(PERMISSION_SUCCESSES.DELETE_PERMISSION_SUCCESS);
      },
      onError: () => {
        toast.error(PERMISSION_ERRORS.DELETE_PERMISSION_ERROR);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-semibold"> {permission.name}</h1>
      </div>
      <FormEditPermission initialState={permission} id={permissionId} />
      <div>
        <Button
          id="delete-button"
          type="button"
          onClick={onDelete}
          disabled={deletePermissionMutation.isPending}
        >
          Delete
          {deletePermissionMutation.isPending && GLOBAL_UI.BUTTONS.DELETING}
        </Button>
      </div>
    </div>
  );
}
