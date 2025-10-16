"use client";

import { Button } from "global/ui";
import { useRouter } from "next/navigation";
import { deleteCategory } from "modules/categories/categories.api";
import FormEditCategory from "../FormEditCategory/FormEditCategory";
import { FormEvent, useState } from "react";
import { Edit } from "ui/Icons/Edit";
import { Delete } from "ui/Icons/Delete";
import "./EditState.style.css";

type CategoryPublic = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export default function EditState({
  initialState,
  id,
  slug,
}: {
  initialState: CategoryPublic;
  id: string;
  slug: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // setIsEditing(false);
  };
  const router = useRouter();

  const onDelete = async () => {
    await deleteCategory(slug);
    router.push("/categories");
    router.refresh();
  };

  return (
    <div className="category-content">
      {!isEditing && (
        <div className="category-header">
          <div>
            <h1 className="title"> {initialState.name}</h1>
          </div>
          <div className="category-buttons">
            <Button variant="transparent" onClick={() => setIsEditing(true)}>
              <Edit />
            </Button>
            <Button variant="transparent" id="delete-button" type="button" onClick={onDelete}>
              <Delete />
            </Button>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="form-container" onSubmit={handleSubmit}>
          <div>
            <h1 className="title"> {initialState.name}</h1>
          </div>
          <FormEditCategory
            initialState={{
              name: initialState.name,
              slug: initialState.slug,
              description: initialState.description ?? undefined,
            }}
            id={id}
          />
        </div>
      )}
    </div>
  );
}
