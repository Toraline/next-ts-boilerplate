"use client";

import { Button } from "global/ui";
import { useRouter } from "next/navigation";
import { useDeleteCategory, useCategory, CATEGORIES_UI, CATEGORY_ERRORS } from "../..";
import { GLOBAL_UI } from "global/constants";
import FormEditCategory from "../FormEditCategory/FormEditCategory";
import { FormEvent, useState } from "react";
import { Edit } from "ui/Icons/Edit";
import { Delete } from "ui/Icons/Delete";
import "./EditState.style.css";

export default function EditState({ categoryIdOrSlug }: { categoryIdOrSlug: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { data: category, isLoading, error } = useCategory(categoryIdOrSlug);
  const deleteCategoryMutation = useDeleteCategory();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // setIsEditing(false);
  };

  const onDelete = async () => {
    if (!category || !confirm(CATEGORIES_UI.CONFIRMATIONS.DELETE_CATEGORY)) return;

    deleteCategoryMutation.mutate(category.slug, {
      onSuccess: () => {
        router.push("/categories");
      },
      onError: (error) => {
        console.error(CATEGORY_ERRORS.DELETE_CATEGORY_ERROR, error);
      },
    });
  };

  if (isLoading) {
    return <div className="category-content">{CATEGORIES_UI.LOADING.LOADING_CATEGORY}</div>;
  }

  if (error) {
    return (
      <div className="category-content">
        {CATEGORY_ERRORS.ERROR_LOADING_CATEGORY}: {error.message}
      </div>
    );
  }

  if (!category) {
    return <div className="category-content">{CATEGORIES_UI.EMPTY_STATES.CATEGORY_NOT_FOUND}</div>;
  }

  return (
    <div className="category-content">
      {!isEditing && (
        <div className="category-header">
          <div>
            <h1 className="title"> {category.name}</h1>
          </div>
          <div className="category-buttons">
            <Button variant="transparent" onClick={() => setIsEditing(true)}>
              <Edit />
            </Button>
            <Button
              variant="transparent"
              id="delete-button"
              type="button"
              onClick={onDelete}
              disabled={deleteCategoryMutation.isPending}
            >
              <Delete />
              {deleteCategoryMutation.isPending && GLOBAL_UI.BUTTONS.DELETING}
            </Button>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="form-container" onSubmit={handleSubmit}>
          <div>
            <h1 className="title"> {category.name}</h1>
          </div>
          <FormEditCategory
            initialState={category}
            id={categoryIdOrSlug}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
