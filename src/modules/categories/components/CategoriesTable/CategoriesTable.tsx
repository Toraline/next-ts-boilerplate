"use client";

import {
  Category,
  useDeleteCategory,
  CATEGORIES_UI,
  CATEGORY_ERRORS,
  CATEGORY_SUCCESSES,
} from "../..";
import { GLOBAL_UI } from "global/constants";
import { Button, Table, TableColumn } from "global/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CategoriesTableProps = {
  items: Category[];
  loading: boolean;
  totalPages: number;
  page: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortDir: "asc" | "desc") => void;
  currentSort?: { sortBy: string; sortDir: "asc" | "desc" };
};

export default function CategoriesTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: CategoriesTableProps) {
  const deleteCategoryMutation = useDeleteCategory();

  const route = useRouter();

  const onDelete = async (slug: string) => {
    if (!confirm(CATEGORIES_UI.CONFIRMATIONS.DELETE_CATEGORY)) return;

    deleteCategoryMutation.mutate(slug, {
      onSuccess: () => {
        toast.success(CATEGORY_SUCCESSES.DELETE_CATEGORY_SUCCESS);
        route.push("/categories");
      },
      onError: () => {
        toast.error(CATEGORY_ERRORS.DELETE_CATEGORY_ERROR);
        // Global error handler will handle this, but we can add specific UI feedback if needed
      },
    });
  };

  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      label: CATEGORIES_UI.TABLE_COLUMNS.NAME,
      sortable: true,
    },
    {
      key: "slug",
      label: CATEGORIES_UI.TABLE_COLUMNS.SLUG,
      sortable: true,
    },
    {
      key: "description",
      label: CATEGORIES_UI.TABLE_COLUMNS.DESCRIPTION,
      render: (item) =>
        item.description || (
          <span className="text-gray-500 italic">{CATEGORIES_UI.EMPTY_STATES.NO_DESCRIPTION}</span>
        ),
    },
    {
      key: "createdAt",
      label: CATEGORIES_UI.TABLE_COLUMNS.CREATED,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: CATEGORIES_UI.TABLE_COLUMNS.UPDATED,
      sortable: true,
      render: (item) => new Date(item.updatedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: CATEGORIES_UI.TABLE_COLUMNS.ACTIONS,
      render: (item) => (
        <div className="flex gap-2">
          <Button href={`/categories/${item.slug}`} className="text-blue-500 hover:underline">
            {GLOBAL_UI.ACTIONS.EDIT}
          </Button>
          <Button
            id="delete-button"
            type="button"
            onClick={() => onDelete(item.slug)}
            disabled={deleteCategoryMutation.isPending}
            className="text-red-500 hover:underline disabled:opacity-50"
          >
            {deleteCategoryMutation.isPending
              ? GLOBAL_UI.BUTTONS.DELETING
              : GLOBAL_UI.ACTIONS.DELETE}
          </Button>
          {deleteCategoryMutation.error && (
            <p className="error text-sm">{deleteCategoryMutation.error.message}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={items}
      columns={columns}
      loading={loading}
      totalPages={totalPages}
      currentPage={page}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      currentSort={currentSort}
      getRowKey={(item) => item.slug}
    />
  );
}
