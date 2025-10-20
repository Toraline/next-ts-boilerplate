"use client";

import "./CategoriesListView.style.css";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CategoriesTable from "../components/CategoriesTable/CategoriesTable";
import {
  useCategoriesList,
  categoriesListFiltersSchema,
  CategoriesListFilters,
  ListCategoriesQuery,
  CATEGORIES_UI,
  CATEGORY_ERRORS,
} from "..";
import { GLOBAL_UI } from "global/constants";
import { Field } from "global/ui/Field/Field";

export default function CategoriesListView() {
  // State for filters, pagination, and sorting
  const [filters, setFilters] = useState<CategoriesListFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Build the complete query object with defaults
  const query: ListCategoriesQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || "createdAt",
    sortDir: filters.sortDir || "desc",
    search: filters.search,
  };

  const { data: categoriesResponse, isLoading, error } = useCategoriesList(query);

  // Form for search and sorting
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriesListFilters>({
    resolver: zodResolver(categoriesListFiltersSchema),
    defaultValues: {
      search: "",
      sortBy: "createdAt",
      sortDir: "desc",
    },
  });

  const items = categoriesResponse?.items || [];
  const total = categoriesResponse?.total || 0;
  const page = categoriesResponse?.page || 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Form handlers
  const onFiltersSubmit = (data: CategoriesListFilters) => {
    setFilters(data);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onSortChange = (sortBy: string, sortDir: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as "createdAt" | "name" | "updatedAt" | "slug",
      sortDir,
    }));
    setCurrentPage(1);
  };

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Show error state
  if (error) {
    return (
      <div className="page">
        <h1>{CATEGORY_ERRORS.ERROR_LOADING_CATEGORIES}</h1>
        <p className="error">{GLOBAL_UI.MESSAGES.SOMETHING_WENT_WRONG}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{CATEGORIES_UI.HEADERS.CATEGORIES}</h1>

      {/* Search and Sort Form */}
      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <Field
          {...register("search")}
          placeholder={CATEGORIES_UI.PLACEHOLDERS.SEARCH}
          id="search-categories"
          error={errors.search?.message}
        />
        <select {...register("sortBy")} className="border rounded p-2">
          <option value="createdAt">{CATEGORIES_UI.SORT_OPTIONS.CREATED_AT}</option>
          <option value="name">{CATEGORIES_UI.SORT_OPTIONS.NAME}</option>
          <option value="slug">{CATEGORIES_UI.SORT_OPTIONS.SLUG}</option>
          <option value="updatedAt">{CATEGORIES_UI.SORT_OPTIONS.UPDATED_AT}</option>
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
          {CATEGORIES_UI.PAGINATION.CATEGORIES} • {GLOBAL_UI.PAGINATION.PAGE} {page}{" "}
          {GLOBAL_UI.PAGINATION.OF} {totalPages}
        </p>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div>{CATEGORIES_UI.LOADING.LOADING_CATEGORIES}</div>
      ) : items.length > 0 ? (
        <>
          <CategoriesTable
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
          <h1 className="no-content__title">{CATEGORIES_UI.EMPTY_STATES.NO_CATEGORIES_FOUND}</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0
              ? CATEGORIES_UI.EMPTY_STATES.TRY_ADJUSTING_FILTERS
              : CATEGORIES_UI.EMPTY_STATES.CREATE_FIRST_CATEGORY}
          </h3>
        </div>
      )}

      {/* Create Category Link */}
      <div className="mt-4">
        <Link href="/categories/new">{CATEGORIES_UI.LINKS.CREATE_CATEGORY}</Link>
      </div>
    </div>
  );
}
