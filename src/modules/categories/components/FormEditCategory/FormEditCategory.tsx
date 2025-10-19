"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "global/ui";
import { Field } from "ui/Field";
import { TextArea } from "ui/TextArea";
import { useUpdateCategory, createCategorySchema, CreateCategory, Category } from "../..";
import "./FormEditCategory.style.css";

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
      setNoChangesMessage("No changes detected. Please modify at least one field before saving.");
      return;
    }

    updateCategoryMutation.mutate(
      { categoryIdOrSlug: id, updates },
      {
        onSuccess: (updatedCategory) => {
          onSuccess?.();
          router.push(`/categories/${updatedCategory.slug}`);
        },
        onError: (error) => {
          console.error("Failed to update category:", error);
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
            label="Name"
            {...register("name")}
            id="category-name"
            type="text"
            error={errors.name?.message}
          />
          <Field
            label="Slug"
            {...register("slug")}
            id="category-slug"
            type="text"
            error={errors.slug?.message}
          />
        </div>
        <TextArea
          {...register("description")}
          id="description"
          label="Description"
          placeholder={initialState.name + " description"}
          error={errors.description?.message}
        />
        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
