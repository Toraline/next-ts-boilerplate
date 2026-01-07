import { useState } from "react";
import { ListRolesQuery, RolesListFilters } from "../types";
import { useRolesList } from "../hooks/useRolesList";
import { useForm } from "react-hook-form";
import { rolesListFiltersSchema } from "../schema";
import { GLOBAL_UI } from "global/constants";
import { ROLE_ERRORS } from "../constants/errors";
import { ROLES_UI } from "../constants/ui";
import RolesTable from "../components/RolesTable/RolesTable";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Field } from "global/ui";

export default function RolesListView() {
  const [filters, setFilters] = useState<RolesListFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const query: ListRolesQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || "createdAt",
    sortDir: filters.sortDir || "desc",
    search: filters.search,
  };

  const { data: rolesResponse, isLoading, error } = useRolesList(query);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RolesListFilters>({
    resolver: zodResolver(rolesListFiltersSchema),
    defaultValues: {
      search: "",
      sortBy: "createdAt",
      sortDir: "desc",
    },
  });

  const items = rolesResponse?.items || [];
  const total = rolesResponse?.total || 0;
  const page = rolesResponse?.page || 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  console.log({ items });

  const onFiltersSubmit = (data: RolesListFilters) => {
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
        <h1>{ROLE_ERRORS.ERROR_LOADING_ROLES}</h1>
        <p className="error">{GLOBAL_UI.MESSAGES.SOMETHING_WENT_WRONG}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-lvh">
      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <Field
          {...register("search")}
          placeholder={ROLES_UI.PLACEHOLDERS.SEARCH}
          id="search-roles"
          error={errors.search?.message}
        />
        <select {...register("sortBy")} className="border rounded p-2">
          <option value="createdAt">{ROLES_UI.SORT_OPTIONS.CREATED_AT}</option>

          <option value="key">{ROLES_UI.SORT_OPTIONS.KEY}</option>

          <option value="name">{ROLES_UI.SORT_OPTIONS.NAME}</option>

          <option value="updatedAt">{ROLES_UI.SORT_OPTIONS.UPDATED_AT}</option>
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
          {ROLES_UI.PAGINATION.ROLES} • {GLOBAL_UI.PAGINATION.PAGE} {page} {GLOBAL_UI.PAGINATION.OF}{" "}
          {totalPages}
        </p>
      </div>

      {/* Roles Table */}
      {isLoading ? (
        <div>{ROLES_UI.LOADING.LOADING_ROLES}</div>
      ) : items.length > 0 ? (
        <>
          <RolesTable
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
          <h1 className="no-content__title">{ROLES_UI.EMPTY_STATES.NO_ROLES_FOUND}</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0 && ROLES_UI.EMPTY_STATES.TRY_ADJUSTING_FILTERS}
          </h3>
        </div>
      )}
      {/* Create Role Link */}
      <div className="mt-4">
        <Link href="/admin/roles/new">{ROLES_UI.LINKS.CREATE_ROLE}</Link>
      </div>
    </div>
  );
}
