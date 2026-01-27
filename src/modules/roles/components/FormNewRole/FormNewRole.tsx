"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, TextArea } from "global/ui";
import { Checkbox } from "global/ui/Checkbox";
import { usePermissionsList } from "modules/permissions/hooks/usePermissionsList";
import { ROLE_ERRORS, ROLE_SUCCESSES, ROLES_UI } from "modules/roles/constants";
import { useCreateRole } from "modules/roles/hooks/useCreateRole";
import { createRoleSchema } from "modules/roles/schema";
import { CreateRole } from "modules/roles/types";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export const FormNewRole = () => {
  const createRoleMutation = useCreateRole();
  const router = useRouter();

  const onSubmit = (data: CreateRole) => {
    createRoleMutation.mutate(
      {
        ...data,
        key: data.key.toUpperCase(),
      },
      {
        onSuccess: () => {
          toast.success(ROLE_SUCCESSES.CREATE_ROLE_SUCCESS);
          router.push("/admin/roles");
        },
        onError: () => {
          toast.error(ROLE_ERRORS.CREATE_ROLE_ERROR);
        },
      },
    );
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRole>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
    },
  });
  const fetchPermissions = usePermissionsList();
  const isLoading = createRoleMutation.isPending || isSubmitting;
  const handleChange = (value: string[], e, permission, field) => {
    const checked = e.target.checked;

    if (checked) {
      field.onChange([...value, permission.key]);
    } else {
      field.onChange(value.filter((key) => key !== permission.key));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Field
            label={ROLES_UI.LABELS.KEY}
            id="key"
            type="text"
            placeholder={ROLES_UI.PLACEHOLDERS.KEY}
            {...register("key")}
            error={errors.key?.message}
          />
          <Field
            label={ROLES_UI.LABELS.NAME}
            id="name"
            type="text"
            placeholder={ROLES_UI.PLACEHOLDERS.NAME}
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <TextArea
          label={ROLES_UI.LABELS.DESCRIPTION}
          id="description"
          placeholder={ROLES_UI.PLACEHOLDERS.DESCRIPTION}
          {...register("description")}
          error={errors.description?.message}
        />
        <h1>Permissions</h1>
        {fetchPermissions.data?.items.map((permission) => (
          <Controller
            key={permission.key}
            name="permissionKeys"
            control={control}
            render={({ field }) => {
              const value = field.value ?? [];
              const isChecked =
                value.some((key) => key === permission.key) || permission.isRequired;
              return (
                <Checkbox
                  id={permission.key}
                  label={permission.name}
                  checked={isChecked}
                  disabled={permission.isRequired}
                  onChange={(e) => handleChange(value, e, permission, field)}
                />
              );
            }}
          />
        ))}
        <div className="flex p-4">
          <Button aria-label="save" type="submit" disabled={isLoading}>
            {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE}
          </Button>
        </div>
      </form>
    </div>
  );
};
