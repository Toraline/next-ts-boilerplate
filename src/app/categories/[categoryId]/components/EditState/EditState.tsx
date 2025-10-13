"use client";

import { useRouter } from "next/navigation";
import { deleteCategory } from "modules/categories/categories.api";
import { Button } from "ui/Button/Button";
import FormEditCategory from "../FormEditCategory/FormEditCategory";
import { FormEvent, useState } from "react";
import { Category } from "modules/categories";
import { Edit } from "ui/Icons/Edit";
import { Delete } from "ui/Icons/Delete";
import "./EditState.style.css";

export default function EditState({
  initialState,
  id,
  slug,
}: {
  initialState: Category;
  id: string;
  slug: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
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
          <div className="form-title">
            <h1 className="title"> {initialState.name}</h1>
          </div>
          <FormEditCategory initialState={initialState} id={id} />
        </div>
      )}
    </div>
  );
}
