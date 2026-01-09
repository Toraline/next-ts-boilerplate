"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Button, Field, Select } from "global/ui";
import { USER_ERRORS } from "modules/users/constants/errors";
import { USER_SUCCESSES } from "modules/users/constants/successes";
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
          toast.success(USER_SUCCESSES.CREATE_USER_SUCCESS);
        },
        onError: () => {
          toast.error(USER_ERRORS.CREATE_USER_ERRORS);
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
      status: "INVITED",
      tenantId: "",
    },
  });

  const isLoading = createUserMutation.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-4">
          <Field
            label="Name"
            id="name"
            placeholder=""
            {...register("name")}
            error={errors.name?.message}
          />
          <Field
            label="Email"
            id="email"
            placeholder=""
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <Field
          label="Tenant ID"
          id="tenantId"
          placeholder=""
          {...register("tenantId")}
          error={errors.tenantId?.message}
        />
        <Field
          label="Profile Picture URL:"
          type="url"
          id="imageUrlInput"
          placeholder="Enter the image URL here"
          {...register("avatarUrl")}
          error={errors.avatarUrl?.message}
        />

        <Select
          label="Status"
          placeholder="Select the status"
          selectedKey={"INVITED"}
          options={[
            { label: "Invited", value: "INVITED" },
            { label: "Active", value: "ACTIVE" },
            { label: "Suspended", value: "SUSPENDED" },
          ]}
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
