"use client";

import { useCategory } from "modules/categories";
import { ApiError } from "lib/client-errors";
import EditState from "../EditState/EditState";
import { Tasks } from "../Tasks/Tasks";

type CategoryContentProps = {
  categoryIdOrSlug: string;
};

export default function CategoryContent({ categoryIdOrSlug }: CategoryContentProps) {
  const { data: category, isLoading, error } = useCategory(categoryIdOrSlug);

  if (isLoading) {
    return (
      <div className="category-wrapper">
        <div>Loading category...</div>
      </div>
    );
  }

  if (error) {
    // Check if it's a 404 error specifically
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="category-wrapper">
          <div>Category not found</div>
        </div>
      );
    }

    return (
      <div className="category-wrapper">
        <div>Error loading category: {error.message}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-wrapper">
        <div>Category not found</div>
      </div>
    );
  }

  return (
    <div className="category-wrapper">
      <EditState categoryIdOrSlug={categoryIdOrSlug} />
      <div className="task-wrapper">
        <Tasks />
      </div>
    </div>
  );
}
