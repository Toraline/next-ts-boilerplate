"use client";

import { useCategory, CATEGORIES_UI, CATEGORY_ERRORS } from "../..";
import { ApiError } from "lib/client/errors";
import EditState from "../EditState/EditState";
import { Tasks } from "modules/tasks/components/Tasks";

type CategoryContentProps = {
  categoryIdOrSlug: string;
};

export default function CategoryContent({ categoryIdOrSlug }: CategoryContentProps) {
  const { data: category, isLoading, error } = useCategory(categoryIdOrSlug);

  if (isLoading) {
    return (
      <div className="flex-col flex pt-20 pl-40 gap-14">
        <div>{CATEGORIES_UI.LOADING.LOADING_CATEGORY}</div>
      </div>
    );
  }

  if (error) {
    // Check if it's a 404 error specifically
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="flex-col flex pt-20 pl-40 gap-14 max-w-2xl">
          <div>{CATEGORIES_UI.EMPTY_STATES.CATEGORY_NOT_FOUND}</div>
        </div>
      );
    }

    return (
      <div className="flex-col flex pt-20 pl-40 gap-14 max-w-2xl">
        <div>
          {CATEGORY_ERRORS.ERROR_LOADING_CATEGORY}: {error.message}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex-col flex pt-20 pl-40 gap-14 max-w-2xl">
        <div>{CATEGORIES_UI.EMPTY_STATES.CATEGORY_NOT_FOUND}</div>
      </div>
    );
  }

  return (
    <div className="flex-col flex pt-20 pl-40 gap-14 max-w-2xl">
      <EditState categoryIdOrSlug={categoryIdOrSlug} />

      <Tasks categoryId={category.id} />
    </div>
  );
}
