import { useQuery } from "@tanstack/react-query";
import { Button, Table, TableColumn } from "global/ui";
import { Role } from "../../types";
import { ROLES_UI } from "../../constants/ui";
import { GLOBAL_UI } from "global/constants";
import { toast } from "sonner";
import { ROLE_ERRORS, ROLE_SUCCESSES } from "../../constants";
import { useDeleteRole } from "../../hooks/useDeleteRole";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";

const authClient = createAuthClient();

type RolesTableProps = {
  items: Role[];
  loading: boolean;
  totalPages: number;
  page: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortDir: "asc" | "desc") => void;
  currentSort?: { sortBy: string; sortDir: "asc" | "desc" };
};

export default function RolesTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: RolesTableProps) {
  const deleteRoleMutation = useDeleteRole();

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageRolesPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.ROLES_MANAGE,
  );

  const onDelete = async (id: string) => {
    if (!confirm(ROLES_UI.CONFIRMATIONS.DELETE_ROLE)) return;

    deleteRoleMutation.mutate(id, {
      onSuccess: () => {
        toast.success(ROLE_SUCCESSES.DELETE_ROLE_SUCCESS);
      },
      onError: () => {
        toast.error(ROLE_ERRORS.DELETE_ROLE_ERROR);
      },
    });
  };

  const columns: TableColumn<Role>[] = [
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
      label: ROLES_UI.TABLE_COLUMNS.ACTIONS,
      render: (item) => (
        <div className="flex gap-2">
          {hasManageRolesPermission && (
            <>
              <Button
                href={`/admin/roles/${item.id}`}
                className="text-blue-500 hover:underline disabled:opacity-50 cursor-pointer"
              >
                {GLOBAL_UI.ACTIONS.EDIT}
              </Button>
              <Button
                id="delete-button"
                type="button"
                className="text-red-500 hover:underline disabled:opacity-50
            cursor-pointer"
                onClick={() => onDelete(item.id)}
                disabled={deleteRoleMutation.isPending}
              >
                {deleteRoleMutation.isPending
                  ? GLOBAL_UI.BUTTONS.DELETING
                  : GLOBAL_UI.ACTIONS.DELETE}
              </Button>
            </>
          )}
          {deleteRoleMutation.error && (
            <p className="error text-sm">{deleteRoleMutation.error.message}</p>
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
      getRowKey={(item) => item.id}
    />
  );
}
