"use client";

import "./FormNewCategory.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "ui/Field/Field";
import { Button } from "global/ui";
import { TextArea } from "ui/TextArea";
import { useCreateCategory, createCategorySchema, CreateCategory } from "modules/categories";

export default function FormNewCategory() {
  const router = useRouter();
  const createCategoryMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateCategory) => {
    createCategoryMutation.mutate(data, {
      onSuccess: (createdCategory) => {
        // Navigate immediately without clearing form state to prevent freezing
        router.push(`/categories/${createdCategory.slug}`);
      },
      onError: (error) => {
        // Error handling is done by the global error handler
        console.error("Failed to create category:", error);
      },
    });
  };

  const isLoading = createCategoryMutation.isPending || isSubmitting;

  return (
    <div className="form-container">
      <h1 className="title">New Category</h1>
      {createCategoryMutation.error && (
        <p className="error">{createCategoryMutation.error.message}</p>
      )}
      <form className="form-new-category" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-new-category__header">
          <Field
            label="Name"
            {...register("name")}
            id="category-name"
            type="text"
            placeholder="Enter the name of the category"
            error={errors.name?.message}
          />
          <Field
            label="Slug"
            {...register("slug")}
            id="category-slug"
            type="text"
            placeholder="Enter the slug of the category"
            error={errors.slug?.message}
          />
        </div>
        <TextArea
          {...register("description")}
          id="category-description"
          placeholder="Enter the category description"
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
