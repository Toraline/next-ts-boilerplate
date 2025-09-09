import { Button } from "ui/Button/Button";
import { Delete } from "../../../Icons/Delete";
import React from "react";

type DeleteButtonProps = {
  onDelete?: () => void;
};

export const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };
  return (
    <Button aria-label="delete" onClick={handleDelete}>
      <Delete />
    </Button>
  );
};
