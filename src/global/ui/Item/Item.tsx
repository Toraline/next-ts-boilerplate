"use client";

import { useState } from "react";
import "./Item.css";
import { Editing } from "./components/Editing/Editing";
import { NotEditing } from "./components/NotEditing/NotEditing";

type ItemProps = {
  onComplete?: (checked: boolean) => void;
  isLoading: boolean;
  editButton?: boolean;
  checkbox?: boolean;
  content?: string;
  onSaveEdit?: (content: string) => void;
  onDelete?: () => void;
};

export const Item = ({
  onComplete,
  isLoading,
  editButton,
  checkbox,
  content,
  onSaveEdit,
  onDelete,
}: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  // const itemIsDoneClass = isDone ? " item--done" : "";

  const toggleEditMode = (e) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };
  const handleSaveEdit = (e, description: string) => {
    toggleEditMode(e);
    onSaveEdit?.(description);
  };
  const handleCheckbox = (checked) => {
    onComplete?.(checked);
    console.log("clicou");
  };

  return (
    <div
    // className={itemIsDoneClass}
    // onClick={(e) => {
    //   e.stopPropagation();
    //   onComplete?.(!isDone);
    // }}
    >
      {isEditing ? (
        <Editing isLoading={isLoading} initialValue={content} onSaveEdit={handleSaveEdit} />
      ) : (
        <NotEditing
          editButton={editButton}
          checkbox={checkbox}
          onDelete={onDelete}
          onClick={toggleEditMode}
          content={content}
          onComplete={handleCheckbox}
        />
      )}
    </div>
  );
};
