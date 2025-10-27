"use client";

import { useCategory, CATEGORIES_UI, CATEGORY_ERRORS } from "../..";
import { ApiError } from "lib/client/errors";
import EditState from "../EditState/EditState";
import { Tasks } from "../../../tasks/components/Tasks";

type CategoryContentProps = {
  categoryIdOrSlug: string;
};

export default function CategoryContent({ categoryIdOrSlug }: CategoryContentProps) {
  const { data: category, isLoading, error } = useCategory(categoryIdOrSlug);

  if (isLoading) {
    return (
      <div className="category-wrapper">
        <div>{CATEGORIES_UI.LOADING.LOADING_CATEGORY}</div>
      </div>
    );
  }

  if (error) {
    // Check if it's a 404 error specifically
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="category-wrapper">
          <div>{CATEGORIES_UI.EMPTY_STATES.CATEGORY_NOT_FOUND}</div>
        </div>
      );
    }

    return (
      <div className="category-wrapper">
        <div>
          {CATEGORY_ERRORS.ERROR_LOADING_CATEGORY}: {error.message}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-wrapper">
        <div>{CATEGORIES_UI.EMPTY_STATES.CATEGORY_NOT_FOUND}</div>
      </div>
    );
  }

  return (
    <div className="category-wrapper">
      <EditState categoryIdOrSlug={categoryIdOrSlug} />

      <Tasks categoryId={category.id} />
    </div>
  );
}
