"use client";

import { useState } from "react";
import "./Item.css";
import { Editing } from "./components/Editing/Editing";
import { NotEditing } from "./components/NotEditing/NotEditing";

type ItemProps = {
  editButton?: boolean;
  checkbox?: boolean;
  content?: string;
  isDone?: boolean;
  onContentChange?: (content: string) => void;
  onComplete?: (isDone: boolean) => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

export const Item = ({
  editButton,
  checkbox,
  content,
  isDone,
  onContentChange,
  onComplete,
  onDelete,
  onEdit,
}: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const itemIsDoneClass = isDone ? " item--done" : "";

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.();
    setIsEditing(false);
  };
  const toggleEditMode = (e) => {
    e.stopPropagation();

    setIsEditing(true);
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
        <Editing
          onChange={(e) => onContentChange?.(e.target.value)}
          value={content}
          onClick={handleEdit}
        />
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
