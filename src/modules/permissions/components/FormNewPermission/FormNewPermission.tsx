"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, TextArea } from "global/ui";
import { PERMISSION_ERRORS } from "modules/permissions/constants/errors";
import { PERMISSION_SUCCESSES } from "modules/permissions/constants/successes";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";
import { useCreatePermission } from "modules/permissions/hooks/useCreatePermission";
import { createPermissionSchema } from "modules/permissions/schema";
import { createPermission } from "modules/permissions/server/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const FormNewPermission = () => {
  const createPermissionMutation = useCreatePermission();
  const onSubmit = (data: createPermission) => {
    createPermissionMutation.mutate(data, {
      onSuccess: () => {
        toast.success(PERMISSION_SUCCESSES.CREATE_PERMISSION_SUCCESS);
      },
      onError: () => {
        toast.error(PERMISSION_ERRORS.CREATE_PERMISSION_ERROR);
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<createPermission>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
    },
  });

  const isLoading = createPermissionMutation.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Field
            label={PERMISSIONS_UI.LABELS.KEY}
            id="key"
            type="text"
            placeholder={PERMISSIONS_UI.PLACEHOLDERS.KEY}
            {...register("key")}
            error={errors.key?.message}
          />

          <Field
            id="name"
            type="text"
            label={PERMISSIONS_UI.LABELS.NAME}
            placeholder={PERMISSIONS_UI.PLACEHOLDERS.NAME}
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <TextArea
          label={PERMISSIONS_UI.LABELS.DESCRIPTION}
          id="description"
          placeholder={PERMISSIONS_UI.PLACEHOLDERS.DESCRIPTION}
          {...register("description")}
          error={errors.description?.message}
        />
        <div className="flex p-4">
          <Button aria-label="save" type="submit" disabled={isLoading}>
            {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE}
          </Button>
        </div>
      </form>
    </div>
  );
};
