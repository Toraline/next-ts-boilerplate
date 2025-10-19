"use client";

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
} from "..";
import { Field } from "ui/Field/Field";

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
        <h1>Error loading categories</h1>
        <p className="error">Something went wrong. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Categories</h1>

      {/* Search and Sort Form */}
      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <Field
          {...register("search")}
          placeholder="Search by name/slug/description"
          id="search-categories"
          error={errors.search?.message}
        />
        <select {...register("sortBy")} className="border rounded p-2">
          <option value="createdAt">Created Date</option>
          <option value="name">Name</option>
          <option value="slug">Slug</option>
          <option value="updatedAt">Updated Date</option>
        </select>
        <select {...register("sortDir")} className="border rounded p-2">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button type="submit" className="border rounded px-3">
          Apply Filters
        </button>
      </form>

      {/* Page Size Selector */}
      <div className="flex gap-2 items-center mb-4">
        <label htmlFor="pageSize" className="text-sm font-medium">
          Items per page:
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
          Showing {items.length} of {total} categories • Page {page} of {totalPages}
        </p>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div>Loading categories...</div>
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
          <h1 className="no-content__title">No categories found</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0
              ? "Try adjusting your search or filters"
              : "Create your first category"}
          </h3>
        </div>
      )}

      {/* Create Category Link */}
      <div className="mt-4">
        <Link href="/categories/new">Create Category</Link>
      </div>
    </div>
  );
}
