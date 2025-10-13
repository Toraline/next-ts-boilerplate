"use client";

import { Button } from "global/ui";
import FormEditCategory from "../FormEditCategory/FormEditCategory";
import { FormEvent, useState } from "react";
import { Category } from "modules/categories";
import { Edit } from "ui/Icons/Edit";

export default function EditState({ initialState, id }: { initialState: Category; id: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <>
      <div className="page__header-buttons" onSubmit={handleSubmit}>
        {!isEditing && (
          <Button variant="transparent" onClick={() => setIsEditing(true)}>
            <Edit />
          </Button>
        )}
        {isEditing && <FormEditCategory initialState={initialState} id={id} />}
      </div>
    </>
  );
}
