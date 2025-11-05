"use client";

import { Menu } from "global/components/Menu/Menu";
import Link from "next/link";
import { PlusSign } from "global/ui/icons/PlusSign";
import "./Sidebar.style.css";
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
    <div className="sidebar">
      <ThemeSelect />
      <div className="sidebar-header">
        <Link className="subtitle" href="/categories">
          Categories
        </Link>
        <div className="sidebar__button-container">
          <ThemeSelect />
          <Button href="/categories/new" size="sm">
            <PlusSign className="plus-icon" />
          </Button>
        </div>
      </div>
      <nav>
        {isLoading && <div className="menu">Loading categories...</div>}
        {error && <div className="menu">Error loading categories</div>}
        {!isLoading && !error && <Menu initialState={items} />}
      </nav>
    </div>
  );
};
