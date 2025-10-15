import { MouseEvent } from "react";
import { Button } from "global/ui";
import { Check } from "ui/Icons/Check";
import { EditTask } from "ui/Icons/EditTask";
import { DeleteTask } from "ui/Icons/DeleteTask";
import "./NotEditing.style.css";

type NotEditingProps = {
  onClick: (event: MouseEvent) => void;
  content?: string;
  isDone?: boolean;
  onDelete?: () => void;
  checkbox?: boolean;
  editButton?: boolean;
};

const NotEditing = ({
  editButton = true,
  checkbox = true,
  content,
  isDone,
  onDelete,
  onClick,
}: NotEditingProps) => {
  const contentIsDoneClass = isDone ? " item__content--done" : "";
  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="item__container">
      {checkbox && (
        <div className="item__checkbox" data-testid="checkbox">
          {isDone && <Check aria-label="check" />}
        </div>
      )}

      <p className={`item__content${contentIsDoneClass}`}>{content}</p>

      {editButton && (
        <Button variant="transparent" aria-label="edit" onClick={onClick}>
          <EditTask />
        </Button>
      )}

      {onDelete && (
        <Button variant="transparent" onClick={handleDelete}>
          <DeleteTask />
        </Button>
      )}
    </div>
  );
};
export { NotEditing };
