"use client";

import { useState, Fragment } from "react";
import "./Item.css";
import { Button } from "ui/Button/Button";
import { CheckIcon, DeleteIcon, EditIcon, SaveIcon } from "./components/Icons/Icons";
import { Input } from "ui/Input/Input";

type ItemProps = {
  content: string;
  contentPlaceholder?: string;
  isDone: boolean;
  onContentChange: (content: string) => void;
  onIsDoneChange: (isDone: boolean) => void;
  onDelete?: () => void;
  onEdit: () => void;
};

export const Item = ({
  content,
  isDone,
  onContentChange,
  onIsDoneChange,
  onDelete,
  onEdit,
}: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const contentIsDoneClass = isDone ? " item__content--done" : "";
  const itemIsDoneClass = isDone ? " item--done" : "";

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
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
        onIsDoneChange(!isDone);
      }}
    >
      {isEditing ? (
        <Fragment>
          <Input
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="item__input"
            onClick={(e) => e.stopPropagation()}
          />
          <Button className="item__button--edit" aria-label="save changes" onClick={handleEdit}>
            {<SaveIcon></SaveIcon>}
          </Button>
        </Fragment>
      ) : (
        <div className="item__container">
          <div className="item__checkbox">{isDone && <CheckIcon></CheckIcon>}</div>
          <p className={`item__content${contentIsDoneClass}`}>{content}</p>

          <Button className="item__button" aria-label="edit" onClick={toggleEditMode}>
            {<EditIcon></EditIcon>}
          </Button>

          {onDelete && (
            <Button className="item__button" aria-label="delete" onClick={handleDelete}>
              <DeleteIcon></DeleteIcon>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
