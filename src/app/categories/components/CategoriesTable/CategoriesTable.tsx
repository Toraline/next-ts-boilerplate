"use client";

import Link from "next/link";
import { Category, useDeleteCategory } from "modules/categories";
import { Table, TableColumn } from "global/ui";

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

  const onDelete = async (slug: string) => {
    // eslint-disable-next-line
    if (!confirm("Are you sure you want to delete this category?")) return;

    deleteCategoryMutation.mutate(slug, {
      onError: (error) => {
        console.error("Failed to delete category:", error);
        // Global error handler will handle this, but we can add specific UI feedback if needed
      },
    });
  };

  const columns: TableColumn<Category>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      render: (item) =>
        item.description || <span className="text-gray-500 italic">No description</span>,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: "Updated",
      sortable: true,
      render: (item) => new Date(item.updatedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <Link href={`/categories/${item.slug}`} className="text-blue-500 hover:underline">
            Edit
          </Link>
          <button
            id="delete-button"
            type="button"
            onClick={() => onDelete(item.slug)}
            disabled={deleteCategoryMutation.isPending}
            className="text-red-500 hover:underline disabled:opacity-50"
          >
            {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
          </button>
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
