"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field } from "global/ui";
import { USER_CONSTANTS } from "modules/users/constants";
import { useCreateUser } from "modules/users/hooks/useCreateUser";
import { createUserSchema } from "modules/users/schema";
import { CreateUser } from "modules/users/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const FormNewUser = () => {
  const createUserMutation = useCreateUser();

  const onSubmit = (data: CreateUser) => {
    createUserMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          toast.success(USER_CONSTANTS.SUCCESSES.CREATE_USER_SUCCESS);
        },
        onError: () => {
          toast.error(USER_CONSTANTS.ERRORS.CREATE_USER_ERRORS);
        },
      },
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      name: "",
      avatarUrl: "",
      status: USER_CONSTANTS.STATUS.INVITED,
      tenantId: "",
    },
  });

  const isLoading = createUserMutation.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-4">
          <Field
            label={USER_CONSTANTS.LABELS.NAME}
            id="name"
            placeholder={USER_CONSTANTS.PLACEHOLDERS.NAME}
            {...register("name")}
            error={errors.name?.message}
          />
          <Field
            label={USER_CONSTANTS.PLACEHOLDERS.EMAIL}
            id="email"
            placeholder={USER_CONSTANTS.PLACEHOLDERS.EMAIL}
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <Field
          label={USER_CONSTANTS.PLACEHOLDERS.TENANT_ID}
          id="tenantId"
          placeholder={USER_CONSTANTS.PLACEHOLDERS.TENANT_ID}
          {...register("tenantId")}
          error={errors.tenantId?.message}
        />
        <Field
          label={USER_CONSTANTS.PLACEHOLDERS.TENANT_ID}
          type="url"
          id="imageUrlInput"
          placeholder={USER_CONSTANTS.PLACEHOLDERS.PROFILE_PICTURE}
          {...register("avatarUrl")}
          error={errors.avatarUrl?.message}
        />

        <div>
          <Button aria-label="save" type="submit" disabled={isLoading}>
            {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE}
          </Button>
        </div>
      </form>
    </div>
  );
};
