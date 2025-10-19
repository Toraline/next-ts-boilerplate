"use client";

import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import { useCategoriesList } from "modules/categories";
import "./page.style.css";

export default function Page() {
  const { data: categoriesResponse, isLoading, error } = useCategoriesList();

  const items = categoriesResponse?.items || [];
  const total = categoriesResponse?.total || 0;
  const page = categoriesResponse?.page || 1;
  const pageSize = categoriesResponse?.pageSize || 20;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const loading = isLoading;

  // Show error state
  if (error) {
    return (
      <span className="page">
        <h1>Error loading categories</h1>
        <p>Something went wrong. Please try again later.</p>
      </span>
    );
  }

  return (
    <span className="page">
      {loading ? (
        <div>Loading categories...</div>
      ) : items.length > 0 ? (
        <>
          <h1>Categories</h1>
          Pages: {page} of {totalPages}
          <form action="/categories" className="flex gap-2">
            <input
              name="search"
              placeholder="Search by name/slug/description"
              className="border rounded p-2 w-full"
            />
            <button className="border rounded px-3">Search</button>
          </form>
          <CategoriesTable items={items} loading={loading} totalPages={totalPages} page={page} />
          <Link href="/categories/new">Create Category</Link>
        </>
      ) : (
        <div className="no-content">
          <h1 className="no-content__title">No category selected</h1>
          <h3 className="no-content__subtitle">Select or create a new category</h3>
        </div>
      )}
    </span>
  );
}
