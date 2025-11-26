import { zodResolver } from "@hookform/resolvers/zod";
import { GLOBAL_UI } from "global/constants";
import { Field } from "global/ui";
import { PERMISSION_ERRORS } from "modules/permissions/constants/errors";
import { usePermissionsList } from "modules/permissions/hooks/usePermissionsList";
import { ListPermissionsQuery, PermissionsListFilters } from "modules/permissions/server/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PermissionsTable from "../../PermissionsTable/PermissionsTable";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";
import Link from "next/link";
import { permissionsListFiltersSchema } from "modules/permissions/schema";

export default function PermissionsListView() {
  const [filters, setFilters] = useState<PermissionsListFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const query: ListPermissionsQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || "createdAt",
    sortDir: filters.sortDir || "desc",
    search: filters.search,
  };

  const { data: permissionsResponse, isLoading, error } = usePermissionsList(query);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionsListFilters>({
    resolver: zodResolver(permissionsListFiltersSchema),
    defaultValues: {
      search: "",
      sortBy: "createdAt",
      sortDir: "desc",
    },
  });

  const items = permissionsResponse?.items || [];
  const total = permissionsResponse?.total || 0;
  const page = permissionsResponse?.page || 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const onFiltersSubmit = (data: PermissionsListFilters) => {
    setFilters(data);
    setCurrentPage(1);
  };

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onSortChange = (sortBy: string, sortDir: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as "createdAt" | "name" | "updatedAt" | "key",
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
        <h1>{PERMISSION_ERRORS.ERROR_LOADING_PERMISSIONS}</h1>
        <p className="error">{GLOBAL_UI.MESSAGES.SOMETHING_WENT_WRONG}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center h-lvh">
      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <Field
          {...register("search")}
          placeholder={PERMISSIONS_UI.PLACEHOLDERS.SEARCH}
          id="search-categories"
          error={errors.search?.message}
        />
        <select {...register("sortBy")} className="border rounded p-2">
          <option value="createdAt">{PERMISSIONS_UI.SORT_OPTIONS.CREATED_AT}</option>

          <option value="key">{PERMISSIONS_UI.SORT_OPTIONS.KEY}</option>

          <option value="name">{PERMISSIONS_UI.SORT_OPTIONS.NAME}</option>

          <option value="updatedAt">{PERMISSIONS_UI.SORT_OPTIONS.UPDATED_AT}</option>
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
          {PERMISSIONS_UI.PAGINATION.PERMISSIONS} • {GLOBAL_UI.PAGINATION.PAGE} {page}{" "}
          {GLOBAL_UI.PAGINATION.OF} {totalPages}
        </p>
      </div>

      {/* Permissions Table */}
      {isLoading ? (
        <div>{PERMISSIONS_UI.LOADING.LOADING_PERMISSIONS}</div>
      ) : items.length > 0 ? (
        <>
          <PermissionsTable
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
          <h1 className="no-content__title">{PERMISSIONS_UI.EMPTY_STATES.NO_PERMISSIONS_FOUND}</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0 && PERMISSIONS_UI.EMPTY_STATES.TRY_ADJUSTING_FILTERS}
          </h3>
        </div>
      )}

      {/* Create Permission Link */}
      <div className="mt-4">
        <Link href="/permissions/new">{PERMISSIONS_UI.LINKS.CREATE_PERMISSION}</Link>
      </div>
    </div>
  );
}
