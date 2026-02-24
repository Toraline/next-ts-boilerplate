"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GLOBAL_UI } from "global/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Field } from "global/ui";
import { useQuery } from "@tanstack/react-query";
import { createAuthClient } from "lib/auth/client";
import { useUserPermissions } from "modules/users/hooks/useUserPermissions";
import { PERMISSION_KEYS } from "modules/permissions/constants";
import { USER_CONSTANTS } from "modules/users/constants";
import UsersTable from "../UsersTable/UsersTable";
import { ListUsersQuery, UsersListFilters } from "modules/users/types";
import { useUsersList } from "modules/users/hooks/useUsersList";
import { usersListFiltersSchema } from "modules/users/schema";

const authClient = createAuthClient();

export default function UsersListView() {
  const [filters, setFilters] = useState<UsersListFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const query: ListUsersQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || "createdAt",
    sortDir: filters.sortDir || "desc",
    search: filters.search,
  };

  const { data: usersResponse, isLoading, error } = useUsersList(query);

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const { data: permissionsResponse } = useUserPermissions(sessionQuery.data?.user?.id);

  const hasManageUsersPermission = permissionsResponse?.items.some(
    (permission) => permission.key === PERMISSION_KEYS.USERS_MANAGE,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsersListFilters>({
    resolver: zodResolver(usersListFiltersSchema),
    defaultValues: {
      search: "",
      sortBy: "createdAt",
      sortDir: "desc",
    },
  });

  const items = usersResponse?.items || [];
  const total = usersResponse?.total || 0;
  const page = usersResponse?.page || 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const onFiltersSubmit = (data: UsersListFilters) => {
    setFilters(data);
    setCurrentPage(1);
  };

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onSortChange = (sortBy: string, sortDir: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as "createdAt" | "name" | "updatedAt" | "updatedAt" | "lastLoginAt" | "name",
      sortDir,
    }));
    setCurrentPage(1);
  };

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center h-lvh">
        <h1>{USER_CONSTANTS.ERRORS.ERROR_LOADING_USERS}</h1>
        <p className="error">{GLOBAL_UI.MESSAGES.SOMETHING_WENT_WRONG}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-lvh">
      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <Field
          {...register("search")}
          placeholder={USER_CONSTANTS.PLACEHOLDERS.SEARCH}
          id="search-users"
          error={errors.search?.message}
        />
        <select {...register("sortBy")} className="border rounded p-2">
          <option value="createdAt">{USER_CONSTANTS.SORT_OPTIONS.CREATED_AT}</option>

          <option value="lastLoginAt">{USER_CONSTANTS.SORT_OPTIONS.LAST_LOGIN_AT}</option>

          <option value="email">{USER_CONSTANTS.SORT_OPTIONS.EMAIL}</option>

          <option value="name">{USER_CONSTANTS.SORT_OPTIONS.NAME}</option>

          <option value="updatedAt">{USER_CONSTANTS.SORT_OPTIONS.UPDATED_AT}</option>
        </select>
        <select {...register("sortDir")} className="border rounded p-2">
          <option value="desc">{GLOBAL_UI.SORT.DESCENDING}</option>
          <option value="asc">{GLOBAL_UI.SORT.ASCENDING}</option>
        </select>
        <button type="submit" className="border rounded px-3">
          {GLOBAL_UI.BUTTONS.APPLY_FILTERS}
        </button>
      </form>

      {/* Page Size Selector */}
      <div className="flex gap-2 items-center mb-4">
        <label htmlFor="pageSize" className="text-sm font-medium">
          {GLOBAL_UI.PAGINATION.ITEMS_PER_PAGE}
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Results information */}
      <div className="mb-4">
        <p>
          {GLOBAL_UI.PAGINATION.SHOWING} {items.length} {GLOBAL_UI.PAGINATION.OF} {total}{" "}
          {USER_CONSTANTS.PAGINATION.USERS} • {GLOBAL_UI.PAGINATION.PAGE} {page}{" "}
          {GLOBAL_UI.PAGINATION.OF} {totalPages}
        </p>
      </div>

      {/* Roles Table */}
      {isLoading ? (
        <div>{USER_CONSTANTS.LOADING.LOADING_USERS}</div>
      ) : items.length > 0 ? (
        <>
          <UsersTable
            items={items}
            loading={isLoading}
            totalPages={totalPages}
            page={page}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            currentSort={{
              sortBy: filters.sortBy || "createdAt",
              sortDir: filters.sortDir || "desc",
            }}
          />
        </>
      ) : (
        <div className="no-content">
          <h1 className="no-content__title">{USER_CONSTANTS.EMPTY_STATES.NO_USERS_FOUND}</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0 && USER_CONSTANTS.EMPTY_STATES.TRY_ADJUSTING_FILTERS}
          </h3>
        </div>
      )}
      {hasManageUsersPermission && (
        <div className="mt-4">
          <Link href="/admin/roles/new">{USER_CONSTANTS.LINKS.CREATE_USER}</Link>
        </div>
      )}
    </div>
  );
}
