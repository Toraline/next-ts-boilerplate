import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, TextArea } from "global/ui";
import { Checkbox } from "global/ui/Checkbox";
import { usePermissionsList } from "modules/permissions/hooks/usePermissionsList";
import { ROLE_ERRORS } from "modules/roles/constants/errors";
import { ROLES_SUCCESSES } from "modules/roles/constants/successes";
import { ROLES_UI } from "modules/roles/constants/ui";
import { useUpdateRole } from "modules/roles/hooks/useUpdateRole";
import { createRoleSchema } from "modules/roles/schema";
import { CreateRole, Role } from "modules/roles/types";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormEditRoleProps = {
  initialState: Role;
  roleId: string;
  onSuccess?: () => void;
};

export default function FormEditRole({ initialState, roleId, onSuccess }: FormEditRoleProps) {
  const fetchPermissions = usePermissionsList();

  const updateRoleMutation = useUpdateRole();

  const lockedPermissions = {
    "categories.view": true,
    "categories.edit": true,
    "tasks.view": true,
    "tasks.edit": true,
  };

  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRole>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      key: initialState.key,
      name: initialState.name,
      description: initialState.description || "",
      permissionKeys: initialState.permissions,
    },
  });

  const onSubmit = (data: CreateRole) => {
    setNoChangesMessage(null);
    const updates: Record<string, unknown> = {};

    if (data.key !== initialState.key) {
      updates.key = data.key;
    }

    if (data.name !== initialState.name) {
      updates.name = data.name;
    }
    if (data.description !== initialState.description || "") {
      updates.description = data.description;
    }

    if (data.permissionKeys !== initialState.permissions) {
      updates.permissionKeys = data.permissionKeys;
    }

    if (Object.keys(updates).length === 0) {
      setNoChangesMessage(ROLES_UI.FORM_MESSAGES.NO_CHANGES_DETECTED);
      return;
    }

    updateRoleMutation.mutate(
      { roleId: roleId, updates },
      {
        onSuccess: () => {
          onSuccess?.();
          toast.success(ROLES_SUCCESSES.UPDATE_ROLE_SUCCESS);
        },
        onError: () => {
          toast.error(ROLE_ERRORS.UPDATE_ROLE_ERROR);
        },
      },
    );
  };

  const isLoading = updateRoleMutation.isPending || isSubmitting;

  return (
    <div>
      {updateRoleMutation.error && <div>{updateRoleMutation.error.message}</div>}
      {noChangesMessage && <div>{noChangesMessage}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Field
            label={ROLES_UI.LABELS.NAME}
            {...register("name")}
            id="role-name"
            type="text"
            error={errors.name?.message}
            placeholder={ROLES_UI.PLACEHOLDERS.NAME}
          />
          <Field
            label={ROLES_UI.LABELS.KEY}
            {...register("key")}
            id="role-key"
            type="text"
            error={errors.key?.message}
            placeholder={ROLES_UI.PLACEHOLDERS.KEY}
          />
        </div>
        <div>
          <TextArea
            {...register("description")}
            id="description"
            label={ROLES_UI.LABELS.DESCRIPTION}
            placeholder={ROLES_UI.PLACEHOLDERS.DESCRIPTION}
            error={errors.description?.message}
          />
        </div>
        <div>
          <h1>Permissions</h1>
          {fetchPermissions.data?.items.map((permission) => (
            <Controller
              key={permission.key}
              name="permissionKeys"
              control={control}
              render={({ field }) => {
                const value = field.value ?? [];
                const isChecked = value.some((key) => key === permission.key);

                return (
                  <Checkbox
                    id={permission.key}
                    label={permission.name}
                    checked={isChecked}
                    disabled={lockedPermissions[permission.key]}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      if (checked) {
                        field.onChange([...value, permission.key]);
                      } else {
                        field.onChange(value.filter((key) => key !== permission.key));
                      }
                    }}
                  />
                );
              }}
            />
          ))}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE_CHANGES}
        </Button>
      </form>
    </div>
  );
}
