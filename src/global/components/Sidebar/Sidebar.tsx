"use client";

import { Menu } from "global/components/Menu/Menu";
import Link from "next/link";
import { PlusSign } from "global/ui/icons/PlusSign";
import { useCategoriesList } from "modules/categories";
import { Button } from "global/ui";
import { ThemeSelect } from "../ThemeSelect";

export const Sidebar = () => {
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useCategoriesList({
    pageSize: 20,
  });

  const items = categoriesResponse?.items || [];

  return (
    <div className="flex-col justify-self-start h-dvh border border-neutral-200">
      <ThemeSelect />
      <div className="flex justify-between align-middle py-4">
        <Link className="text-2xl font-semibold" href="/categories">
          Categories
        </Link>
        <div className="px-6">
          <Button href="/categories/new" size="sm">
            <PlusSign className="invert" />
          </Button>
        </div>
      </div>
      <nav>
        {isLoading && (
          <div className="flex flex-col py-1 w-64 text-neutral-400 text-base">
            Loading categories...
          </div>
        )}
        {error && (
          <div className="flex flex-col py-1 w-64 text-neutral-400 text-base">
            Error loading categories
          </div>
        )}
        {!isLoading && !error && <Menu initialState={items} />}
      </nav>
    </div>
  );
};
