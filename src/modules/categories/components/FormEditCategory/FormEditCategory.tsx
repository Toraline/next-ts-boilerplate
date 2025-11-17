"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "global/ui";
import { Field } from "global/ui/Field";
import { TextArea } from "global/ui/TextArea";
import {
  useUpdateCategory,
  createCategorySchema,
  CreateCategory,
  Category,
  CATEGORIES_UI,
  CATEGORY_ERRORS,
} from "../..";
import { GLOBAL_UI } from "global/constants";
import "./FormEditCategory.style.css";
import { toast } from "sonner";
import { CATEGORY_SUCCESSES } from "modules/categories/constants";

export default function FormEditCategory({
  initialState,
  id,
  onSuccess,
}: {
  initialState: Category;
  id: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const updateCategoryMutation = useUpdateCategory();
  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: initialState.name,
      slug: initialState.slug,
      description: initialState.description || "",
    },
  });

  const onSubmit = (data: CreateCategory) => {
    // Clear any previous no-changes message
    setNoChangesMessage(null);

    // Only send fields that have actually changed
    const updates: Record<string, unknown> = {};
    if (data.name !== initialState.name) {
      updates.name = data.name;
    }
    if (data.slug !== initialState.slug) {
      updates.slug = data.slug;
    }
    if (data.description !== (initialState.description || "")) {
      updates.description = data.description;
    }

    // If no fields changed, don't make the request and show message
    if (Object.keys(updates).length === 0) {
      setNoChangesMessage(CATEGORIES_UI.FORM_MESSAGES.NO_CHANGES_DETECTED);
      return;
    }

    updateCategoryMutation.mutate(
      { categoryIdOrSlug: id, updates },
      {
        onSuccess: (updatedCategory) => {
          onSuccess?.();
          toast.success(CATEGORY_SUCCESSES.EDIT_CATEGORY_SUCCESS);
          router.push(`/categories/${updatedCategory.id}`);
        },
        onError: () => {
          toast.error(CATEGORY_ERRORS.UPDATE_CATEGORY_ERROR);
        },
      },
    );
  };

  const isLoading = updateCategoryMutation.isPending || isSubmitting;

  return (
    <div className="form-container">
      {updateCategoryMutation.error && (
        <div className="error">{updateCategoryMutation.error.message}</div>
      )}
      {noChangesMessage && <div className="error">{noChangesMessage}</div>}
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__header">
          <Field
            label={CATEGORIES_UI.LABELS.NAME}
            {...register("name")}
            id="category-name"
            type="text"
            error={errors.name?.message}
          />
          <Field
            label={CATEGORIES_UI.LABELS.SLUG}
            {...register("slug")}
            id="category-slug"
            type="text"
            error={errors.slug?.message}
          />
        </div>
        <TextArea
          {...register("description")}
          id="description"
          label={CATEGORIES_UI.LABELS.DESCRIPTION}
          placeholder={CATEGORIES_UI.PLACEHOLDERS.descriptionWithName(initialState.name)}
          error={errors.description?.message}
        />
        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE_CHANGES}
          </Button>
        </div>
      </form>
    </div>
  );
}
