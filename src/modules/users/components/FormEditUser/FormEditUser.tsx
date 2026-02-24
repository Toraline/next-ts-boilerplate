import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field } from "global/ui";
import { USER_CONSTANTS } from "modules/users/constants";
import { useUpdateUser } from "modules/users/hooks/useUpdateUser";
import { createUserSchema } from "modules/users/schema";
import { CreateUser, User } from "modules/users/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormEditUserProps = {
  initialState: User;
  userId: string;
  onSuccess?: () => void;
  readOnly?: boolean;
};

export default function FormEditRole({
  initialState,
  userId,
  onSuccess,
  readOnly = false,
}: FormEditUserProps) {
  const updateUserMutation = useUpdateUser();

  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: initialState.email,
      name: initialState.name,
      avatarUrl: initialState.avatarUrl,
    },
  });

  const onSubmit = (data: CreateUser) => {
    setNoChangesMessage(null);
    const updates: Record<string, unknown> = {};

    if (data.email !== initialState.email) {
      updates.email = data.email;
    }

    if (data.name !== initialState.name) {
      updates.name = data.name;
    }
    if (data.avatarUrl !== initialState.avatarUrl) {
      updates.avatarUrl = data.avatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      setNoChangesMessage(USER_CONSTANTS.FORM_MESSAGES.NO_CHANGES_DETECTED);
      return;
    }

    updateUserMutation.mutate(
      { userId: userId, updates },
      {
        onSuccess: () => {
          onSuccess?.();
          toast.success(USER_CONSTANTS.SUCCESSES.UPDATE_USER_SUCCESS);
        },
        onError: () => {
          toast.error(USER_CONSTANTS.ERRORS.UPDATE_USER_ERROR);
        },
      },
    );
  };

  const isLoading = updateUserMutation.isPending || isSubmitting;

  return (
    <div>
      {updateUserMutation.error && <div>{updateUserMutation.error.message}</div>}
      {noChangesMessage && <div>{noChangesMessage}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row">
          <Field
            label={USER_CONSTANTS.LABELS.NAME}
            {...register("name")}
            id="user-name"
            type="text"
            error={errors.name?.message}
            placeholder={USER_CONSTANTS.PLACEHOLDERS.NAME}
            disabled={readOnly}
          />
          <Field
            label={USER_CONSTANTS.LABELS.EMAIL}
            {...register("email")}
            id="user-email"
            type="text"
            error={errors.email?.message}
            placeholder={USER_CONSTANTS.PLACEHOLDERS.EMAIL}
            disabled={readOnly}
          />
        </div>
        <div>
          <Field
            {...register("avatarUrl", {
              setValueAs: (value) => (value === "" ? null : value),
            })}
            id="user-avatar-url"
            label={USER_CONSTANTS.LABELS.PROFILE_PICTURE}
            placeholder={USER_CONSTANTS.PLACEHOLDERS.PROFILE_PICTURE}
            error={errors.avatarUrl?.message}
            disabled={readOnly}
            type="url"
          />
        </div>

        <Button type="submit" disabled={isLoading || readOnly}>
          {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE_CHANGES}
        </Button>
      </form>
    </div>
  );
}
