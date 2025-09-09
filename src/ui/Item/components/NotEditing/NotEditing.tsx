import React from "react";
import { Button } from "ui/Button/Button";
import { Check } from "../../../Icons/Check";
import { Edit } from "ui/Icons/Edit";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import "./NotEditing.style.css";

type NotEditingProps = {
  onClick: (event: React.MouseEvent) => void;
  content: string;
  isDone: boolean;
  onDelete?: () => void;
};

const NotEditing = ({ content, isDone, onDelete, onClick }: NotEditingProps) => {
  const contentIsDoneClass = isDone ? " item__content--done" : "";

  return (
    <div className="item__container">
      <div className="item__checkbox">{isDone && <Check />}</div>
      <p className={`item__content${contentIsDoneClass}`}>{content}</p>

      <Button aria-label="edit" onClick={onClick}>
        {<Edit />}
      </Button>

      {onDelete && <DeleteButton onDelete={onDelete} />}
    </div>
  );
};
export { NotEditing };
