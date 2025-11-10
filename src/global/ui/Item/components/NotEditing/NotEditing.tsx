import React, { ChangeEvent, MouseEvent, useState } from "react";
import { Button } from "global/ui";
import { EditTask } from "global/ui/icons/EditTask";
import { DeleteTask } from "global/ui/icons/DeleteTask";
import "./NotEditing.style.css";
import clsx from "clsx";

type NotEditingProps = {
  initialChecked: boolean;
  onComplete: (event: ChangeEvent, checked: boolean) => void;
  onEdit: (event: MouseEvent) => void;
  content?: string;
  onDelete?: () => void;
  checkbox?: boolean;
  editButton?: boolean;
};

const NotEditing = ({
  editButton = true,
  checkbox = true,
  content,
  initialChecked,
  onDelete,
  onEdit,
  onComplete,
}: NotEditingProps) => {
  // const contentIsDoneClass = isDone ? " item__content--done" : "";

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const [checked, setChecked] = useState(initialChecked);
  return (
    <div className="item__container">
      {checkbox && (
        <div className=" item__checkbox" data-testid="checkbox">
          <input
            aria-label="check"
            type="checkbox"
            id="task-checkbox"
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
              onComplete(e, e.currentTarget.checked);
            }}
            checked={checked}
          />
          {/* {isDone && <Check aria-label="check" />} */}
        </div>
      )}

      <p className={clsx("item__content", { "item_content--done": "" })}>{content}</p>

      {editButton && (
        <Button variant="transparent" aria-label="edit" onClick={onEdit}>
          <EditTask />
        </Button>
      )}

      {onDelete && (
        <Button aria-label="delete-button" variant="transparent" onClick={handleDelete}>
          <DeleteTask />
        </Button>
      )}
    </div>
  );
};
export { NotEditing };
