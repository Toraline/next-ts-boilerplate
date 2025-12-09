import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, TextArea } from "global/ui";
import { ROLE_ERRORS } from "modules/roles/constants/errors";
import { ROLES_SUCCESSES } from "modules/roles/constants/successes";
import { ROLES_UI } from "modules/roles/constants/ui";
import { useUpdateRole } from "modules/roles/hooks/useUpdateRole";
import { createRoleSchema } from "modules/roles/schema";
import { CreateRole, Role } from "modules/roles/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function FormEditRole({
  initialState,
  roleId,
  onSuccess,
}: {
  initialState: Role;
  roleId: string;
  checked?: boolean;
  onSuccess?: () => void;
}) {
  const updateRoleMutation = useUpdateRole();

  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRole>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      key: initialState.key,
      name: initialState.name,
      description: initialState.description || "",
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
          toast.error(ROLE_ERRORS.UPDDATE_ERROR);
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
            label={"Name"}
            {...register("name")}
            id="role-name"
            type="text"
            error={errors.name?.message}
            placeholder={"Digite o nome"}
          />
        </div>
        <div>
          <TextArea
            {...register("description")}
            id="description"
            label="Description"
            placeholder="Digite a descrição"
            error={errors.description?.message}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE_CHANGES}{" "}
        </Button>
      </form>
    </div>
  );
}
