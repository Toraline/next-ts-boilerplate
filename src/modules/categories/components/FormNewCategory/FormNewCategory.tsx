"use client";

import "./FormNewCategory.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "global/ui/Field/Field";
import { Button } from "global/ui";
import { TextArea } from "global/ui/TextArea";
import {
  useCreateCategory,
  createCategorySchema,
  CreateCategory,
  CATEGORIES_UI,
  CATEGORY_ERRORS,
  CATEGORY_SUCCESSES,
} from "../..";
import { GLOBAL_UI } from "global/constants";
import { toast } from "sonner";

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
        toast.success(CATEGORY_SUCCESSES.CREATE_CATEGORY_SUCCESS);
        // Navigate immediately without clearing form state to prevent freezing
        router.push(`/categories/${createdCategory.slug}`);
      },
      onError: () => {
        // Error handling is done by the global error handler
        toast.error(CATEGORY_ERRORS.CREATE_CATEGORY_ERROR);
      },
    });
  };

  const isLoading = createCategoryMutation.isPending || isSubmitting;

  return (
    <div className="form-container">
      <h1 className="title">{CATEGORIES_UI.HEADERS.NEW_CATEGORY}</h1>
      {createCategoryMutation.error && (
        <p className="error">{createCategoryMutation.error.message}</p>
      )}
      <form className="form-new-category" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-new-category__header">
          <Field
            label={CATEGORIES_UI.LABELS.NAME}
            {...register("name")}
            id="category-name"
            type="text"
            placeholder={CATEGORIES_UI.PLACEHOLDERS.NAME}
            error={errors.name?.message}
          />
          <Field
            label={CATEGORIES_UI.LABELS.SLUG}
            {...register("slug")}
            id="category-slug"
            type="text"
            placeholder={CATEGORIES_UI.PLACEHOLDERS.SLUG}
            error={errors.slug?.message}
          />
        </div>
        <TextArea
          {...register("description")}
          id="category-description"
          placeholder={CATEGORIES_UI.PLACEHOLDERS.DESCRIPTION}
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
