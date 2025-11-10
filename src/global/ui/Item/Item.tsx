"use client";

import { useState } from "react";
import "./Item.css";
import { Editing } from "./components/Editing/Editing";
import { NotEditing } from "./components/NotEditing/NotEditing";

type ItemProps = {
  onComplete?: (checked: boolean) => void;
  initialChecked: boolean;
  isLoading: boolean;
  editButton?: boolean;
  checkbox?: boolean;
  content?: string;
  onSaveEdit?: (content: string) => void;
  onDelete?: () => void;
};

export const Item = ({
  initialChecked,
  onComplete,
  isLoading,
  editButton,
  checkbox,
  content,
  onSaveEdit,
  onDelete,
}: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = (e) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };
  const handleSaveEdit = (e, description: string) => {
    toggleEditMode(e);
    onSaveEdit?.(description);
  };
  const handleCheckbox = (e, checked: boolean) => {
    onComplete?.(checked);
    e.stopPropagation();
  };

  return (
    <div>
      {isEditing ? (
        <Editing isLoading={isLoading} initialValue={content} onSaveEdit={handleSaveEdit} />
      ) : (
        <NotEditing
          editButton={editButton}
          checkbox={checkbox}
          onDelete={onDelete}
          onEdit={toggleEditMode}
          content={content}
          onComplete={handleCheckbox}
          initialChecked={initialChecked}
        />
      )}
    </div>
  );
};
