import React, { ChangeEvent, MouseEvent, useState } from "react";
import { Button } from "global/ui";
import { EditTask } from "global/ui/icons/EditTask";
import { DeleteTask } from "global/ui/icons/DeleteTask";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type NotEditingProps = {
  checkboxId: string;
  initialChecked: boolean;
  onComplete: (event: ChangeEvent, checked: boolean) => void;
  onEdit: (event: MouseEvent) => void;
  content?: string;
  onDelete?: () => void;
  checkbox?: boolean;
  editButton?: boolean;
};

const NotEditing = ({
  checkboxId,
  editButton = true,
  checkbox = true,
  content,
  initialChecked,
  onDelete,
  onEdit,
  onComplete,
}: NotEditingProps) => {
  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };
  const [checked, setChecked] = useState(initialChecked);

  const cn = (...args) => twMerge(clsx(...args));

  const checkboxClass = cn("p-4 flex gap-2.5 align-middle grow", {
    "bg-neutral-200 line-through": checked == true,
  });

  return (
    <div className={checkboxClass}>
      {checkbox && (
        <input
          aria-label="checkbox"
          type="checkbox"
          id={checkboxId}
          onChange={(e) => {
            setChecked(e.currentTarget.checked);
            onComplete(e, e.currentTarget.checked);
          }}
          checked={checked}
        />
      )}
      <label className=" grow cursor-pointer" htmlFor={checkboxId}>
        {content}
      </label>

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
