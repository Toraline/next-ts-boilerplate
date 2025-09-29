"use client";

import { useRouter } from "next/navigation";
import { deleteCategory } from "modules/categories/categories.api";
import { Button } from "ui/Button/Button";
import { Delete } from "ui/Icons/Delete";

type DeleteCategoryButtonProps = {
  slug: string;
};

export function DeleteCategoryButton({ slug }: DeleteCategoryButtonProps) {
  const router = useRouter();

  const onDelete = async () => {
    await deleteCategory(slug);
    router.push("/categories");
    router.refresh();
  };

  return (
    <Button variant="transparent" id="delete-button" type="button" onClick={onDelete}>
      <Delete />
    </Button>
  );
}
