"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, TextArea } from "global/ui";
import { PERMISSION_ERRORS } from "modules/permissions/constants/errors";
import { PERMISSION_SUCCESSES } from "modules/permissions/constants/successes";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";
import { useUpdatePermission } from "modules/permissions/hooks/useUpdatePermission";
import { createPermissionSchema } from "modules/permissions/schema";
import { CreatePermission, Permission } from "modules/permissions/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const FormEditPermission = ({
  initialState,
  id,
  onSuccess,
  readOnly = false,
}: {
  initialState: Permission;
  id: string;
  onSuccess?: () => void;
  readOnly?: boolean;
}) => {
  const updatePermissionMutation = useUpdatePermission();
  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePermission>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      key: initialState.key,
      name: initialState.name,
      description: initialState.description || "",
    },
  });

  const onSubmit = (data: CreatePermission) => {
    setNoChangesMessage(null);
    const updates: Record<string, unknown> = {};

    if (data.key !== initialState.key) {
      updates.key = data.key;
    }

    if (data.name !== initialState.name) {
      updates.name = data.name;
    }

    if (data.description !== (initialState.description || "")) {
      updates.description = data.description;
    }

    if (Object.keys(updates).length === 0) {
      setNoChangesMessage(PERMISSIONS_UI.FORM_MESSAGES.NO_CHANGES_DETECTED);
      return;
    }

    updatePermissionMutation.mutate(
      { permissionId: id, updates },
      {
        onSuccess: () => {
          onSuccess?.();
          toast.success(PERMISSION_SUCCESSES.UPDATE_PERMISSION_SUCCESS);
        },
        onError: () => {
          toast.error(PERMISSION_ERRORS.UPDATE_PERMISSION_ERROR);
        },
      },
    );
  };

  const isLoading = updatePermissionMutation.isPending || isSubmitting;

  return (
    <div>
      {updatePermissionMutation.error && (
        <div className="error">{updatePermissionMutation.error.message}</div>
      )}
      {noChangesMessage && <div className="error">{noChangesMessage}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Field
            label={PERMISSIONS_UI.LABELS.NAME}
            {...register("name")}
            id="permission-name"
            type="text"
            error={errors.name?.message}
            placeholder={PERMISSIONS_UI.PLACEHOLDERS.NAME}
            disabled={readOnly}
          />
        </div>
        <div>
          <Field
            label={PERMISSIONS_UI.LABELS.KEY}
            {...register("key")}
            id="permission-key"
            type="text"
            error={errors.key?.message}
            placeholder={PERMISSIONS_UI.PLACEHOLDERS.KEY}
          />
        </div>
        <div>
          <TextArea
            {...register("description")}
            id="description"
            label={PERMISSIONS_UI.LABELS.DESCRIPTION}
            placeholder={PERMISSIONS_UI.PLACEHOLDERS.DESCRIPTION}
            error={errors.description?.message}
            disabled={readOnly}
          />
        </div>
        <Button type="submit" disabled={isLoading || readOnly}>
          {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE_CHANGES}
        </Button>
      </form>
    </div>
  );
};
