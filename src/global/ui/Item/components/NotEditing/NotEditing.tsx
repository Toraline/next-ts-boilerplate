import { MouseEvent } from "react";
import { Button } from "global/ui";
import { Check } from "global/ui/icons/Check";
import { EditTask } from "global/ui/icons/EditTask";
import { DeleteTask } from "global/ui/icons/DeleteTask";
import "./NotEditing.style.css";
import clsx from "clsx";

type NotEditingProps = {
  checked?: boolean;
  onComplete: (event: MouseEvent, checked: boolean) => void;
  onClick: (event: MouseEvent) => void;
  content?: string;
  onDelete?: () => void;
  checkbox?: boolean;
  editButton?: boolean;
};

const NotEditing = ({
  editButton = true,
  checkbox = true,
  content,
  checked = false,
  onDelete,
  onClick,
  onComplete,
}: NotEditingProps) => {
  // const contentIsDoneClass = isDone ? " item__content--done" : "";

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="item__container">
      {checkbox && (
        <div className=" item__checkbox" data-testid="checkbox">
          <input type="checkbox" id="task-checkbox" onClick={(e) => onComplete(e, checked)} />
          {/* {isDone && <Check aria-label="check" />} */}
        </div>
      )}

      <p className={clsx("item__content", { "item_content--done": "" })}>{content}</p>

      {editButton && (
        <Button variant="transparent" aria-label="edit" onClick={onClick}>
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
