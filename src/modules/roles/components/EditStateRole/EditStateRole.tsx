"use client";

import { ROLES_UI } from "modules/roles/constants/ui";
import { useRole } from "modules/roles/hooks/useRole";
import FormEditRole from "../FormEditRole.tsx/FormEditRole";
import { ROLE_ERRORS } from "modules/roles/constants/errors";

export default function EditStateRole({ roleId }: { roleId: string }) {
  const { data: role, isLoading, error } = useRole(roleId);

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
    </div>
  );
}
