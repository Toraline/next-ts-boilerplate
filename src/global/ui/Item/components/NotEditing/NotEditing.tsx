import React, { ChangeEvent, MouseEvent, useState } from "react";
import { Button } from "global/ui";
import { EditTask } from "global/ui/icons/EditTask";
import { DeleteTask } from "global/ui/icons/DeleteTask";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

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

  const cn = (...args) => twMerge(clsx(...args));

  const checkboxClass = cn("p-4 flex gap-2.5 align-middle grow", {
    "bg-slate-500 line-through": checked == true,
  });

  return (
    <div className={checkboxClass} onClick={(e) => e.stopPropagation()}>
      {checkbox && (
        <input
          aria-label="checkbox"
          type="checkbox"
          id="checkbox"
          onChange={(e) => {
            setChecked(e.currentTarget.checked);
            onComplete(e, e.currentTarget.checked);
          }}
          checked={checked}
        />
      )}
      <label>{content}</label>

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
