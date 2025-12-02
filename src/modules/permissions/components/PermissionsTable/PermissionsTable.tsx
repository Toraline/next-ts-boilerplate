import { GLOBAL_UI } from "global/constants";
import { Table, TableColumn } from "global/ui";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";
import { Permission } from "modules/permissions/server/types";
import Link from "next/link";

type PermissionsTableProps = {
  items: Permission[];
  loading: boolean;
  totalPages: number;
  page: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortDir: "asc" | "desc") => void;
  currentSort?: { sortBy: string; sortDir: "asc" | "desc" };
};

export default function PermissionsTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: PermissionsTableProps) {
  const columns: TableColumn<Permission>[] = [
    {
      key: "key",
      label: "Key",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
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
      label: PERMISSIONS_UI.TABLE_COLUMNS.ACTIONS,
      render: (item) => (
        <div className="flex gap-2">
          <Link href={`/permissions/${item.id}`} className="text-blue-500 hover:underline">
            {GLOBAL_UI.ACTIONS.EDIT}
          </Link>
          <button
            id="delete-button"
            type="button"
            className="text-red-500 hover:underline disabled:opacity-50
            cursor-pointer"
          >
            Delete
          </button>
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
      getRowKey={(item) => item.id}
    />
  );
}
