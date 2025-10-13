"use client";

import { useRouter } from "next/navigation";
import { deleteCategory } from "modules/categories/categories.api";
import { Button } from "global/ui";
import { Delete } from "ui/Icons/Delete";

type DeleteCategoryProps = {
  slug: string;
};

export function DeleteCategory({ slug }: DeleteCategoryProps) {
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
