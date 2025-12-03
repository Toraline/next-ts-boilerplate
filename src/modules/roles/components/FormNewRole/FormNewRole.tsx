import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, TextArea } from "global/ui";
import { Modal } from "global/ui/Modal/Modal";
import { ROLE_ERRORS, ROLE_SUCCESSES, ROLES_UI } from "modules/roles/constants";
import { useCreateRole } from "modules/roles/hooks/useCreateRole";
import { createRoleSchema } from "modules/roles/schema";
import { CreateRole } from "modules/roles/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const FormNewRole = ({ permissionIds }) => {
  const createRoleMutation = useCreateRole();
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = (data: CreateRole) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        toast.success(ROLE_SUCCESSES.CREATE_ROLE_SUCCESS);
      },
      onError: () => {
        toast.error(ROLE_ERRORS.CREATE_ROLE_ERROR);
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRole>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      permissionIds,
    },
  });
  const isLoading = createRoleMutation.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)}>Create Role</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
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
          <div className="flex p-4">
            <Button
              aria-label="save"
              type="submit"
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
