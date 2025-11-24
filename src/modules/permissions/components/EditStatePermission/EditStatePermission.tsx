"use client";

import { usePermission } from "modules/permissions/hooks/usePermission";
import { FormEditPermission } from "../FormEditPermission/FormEditPermission";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";
import { PERMISSION_ERRORS } from "modules/permissions/constants/errors";

export default function EditStatePermission({ permissionId }: { permissionId: string }) {
  const { data: permission, isLoading, error } = usePermission(permissionId);

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

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-semibold"> {permission.name}</h1>
      </div>
      <FormEditPermission initialState={permission} id={permissionId} />
    </div>
  );
}
