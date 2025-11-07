"use client";

import { useState } from "react";
import "./Item.css";
import { Editing } from "./components/Editing/Editing";
import { NotEditing } from "./components/NotEditing/NotEditing";

type ItemProps = {
  isLoading: boolean;
  editButton?: boolean;
  checkbox?: boolean;
  content?: string;
  isDone?: boolean;
  onSaveEdit?: (content: string) => void;
  onComplete?: (isDone: boolean) => void;
  onDelete?: () => void;
};

export const Item = ({
  isLoading,
  editButton,
  checkbox,
  content,
  isDone,
  onSaveEdit,
  onComplete,
  onDelete,
}: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const itemIsDoneClass = isDone ? " item--done" : "";

  const toggleEditMode = (e) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };
  const handleSaveEdit = (e, description: string) => {
    toggleEditMode(e);
    onSaveEdit?.(description);
  };

  return (
    <div
      className={`item${itemIsDoneClass}`}
      onClick={(e) => {
        e.stopPropagation();
        onComplete?.(!isDone);
      }}
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
          isDone={isDone}
        />
      )}
    </div>
  );
};
