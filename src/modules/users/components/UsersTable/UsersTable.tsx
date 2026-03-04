import { useQuery } from "@tanstack/react-query";
import { Button, Table, TableColumn } from "global/ui";
import { GLOBAL_UI } from "global/constants";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { User } from "modules/users/types";
import { USER_CONSTANTS } from "modules/users/constants";
import { useDeleteUser } from "modules/users/hooks/useDeleteUser";
import { toast } from "sonner";

const authClient = createAuthClient();

type UsersTableProps = {
  items: User[];
  loading: boolean;
  totalPages: number;
  page: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortDir: "asc" | "desc") => void;
  currentSort?: { sortBy: string; sortDir: "asc" | "desc" };
};

export default function UsersTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: UsersTableProps) {
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });
  const deleteUserMutation = useDeleteUser();

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageUsersPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.USERS_MANAGE,
  );

  const onDelete = async (id: string) => {
    if (!confirm(USER_CONSTANTS.CONFIRMATIONS.DELETE_USER)) return;

    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        toast.success(USER_CONSTANTS.SUCCESSES.DELETE_USER_SUCCESS);
      },
      onError: () => {
        toast.error(USER_CONSTANTS.ERRORS.DELETE_USER_ERROR);
      },
    });
  };

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      label: USER_CONSTANTS.TABLE_COLUMNS.NAME,
      sortable: true,
    },
    {
      key: "email",
      label: USER_CONSTANTS.TABLE_COLUMNS.EMAIL,
      sortable: true,
    },
    {
      key: "status",
      label: USER_CONSTANTS.TABLE_COLUMNS.STATUS,
      sortable: true,
    },
    {
      key: "lastLoginAt",
      label: USER_CONSTANTS.TABLE_COLUMNS.LAST_LOGIN_AT,
      sortable: true,
      render: (item) => {
        //All users are returning null for now until we set up clerk, because it will be providing the correct value
        if (item.lastLoginAt) {
          return new Date(item.lastLoginAt).toLocaleDateString();
        }
      },
    },
    {
      key: "createdAt",
      label: USER_CONSTANTS.TABLE_COLUMNS.CREATED_AT,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "deletedAt",
      label: USER_CONSTANTS.TABLE_COLUMNS.DELETED_AT,
      sortable: true,
      render: (item) => {
        if (item.deletedAt) {
          return new Date(item.deletedAt).toLocaleDateString();
        }
      },
    },
    {
      key: "updatedAt",
      label: USER_CONSTANTS.TABLE_COLUMNS.UPDATED_AT,
      sortable: true,
      render: (item) => new Date(item.updatedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: USER_CONSTANTS.TABLE_COLUMNS.ACTIONS,
      render: (item: User) => {
        const rowDeleting = deleteUserMutation.variables === item.id;
        const errorDeletingRow = deleteUserMutation.isError && rowDeleting;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              {hasManageUsersPermission && (
                <>
                  <Button
                    href={`/admin/users/${item.id}`}
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
                    disabled={deleteUserMutation.isPending && errorDeletingRow}
                  >
                    {deleteUserMutation.isPending && errorDeletingRow
                      ? GLOBAL_UI.BUTTONS.DELETING
                      : GLOBAL_UI.ACTIONS.DELETE}
                  </Button>
                </>
              )}
            </div>
            {errorDeletingRow && (
              <p>{deleteUserMutation.error && deleteUserMutation.error.message}</p>
            )}
          </div>
        );
      },
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
