import React from "react";
import { Button } from "ui/Button/Button";
import { Check } from "ui/Icons/Check";
import { Edit } from "ui/Icons/Edit";
import { Delete } from "ui/Icons/Delete";
import "./NotEditing.style.css";

type NotEditingProps = {
  onClick: (event: React.MouseEvent) => void;
  content: string;
  isDone: boolean;
  onDelete?: () => void;
};

const NotEditing = ({ content, isDone, onDelete, onClick }: NotEditingProps) => {
  const contentIsDoneClass = isDone ? " item__content--done" : "";
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="item__container">
      <div className="item__checkbox">{isDone && <Check />}</div>
      <p className={`item__content${contentIsDoneClass}`}>{content}</p>

      <Button variant="transparent" aria-label="edit" onClick={onClick}>
        {<Edit />}
      </Button>

      {onDelete && (
        <Button variant="transparent" onClick={handleDelete}>
          <Delete />
        </Button>
      )}
    </div>
  );
};
export { NotEditing };
