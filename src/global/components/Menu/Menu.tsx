"use client";

import { Category } from "modules/categories";
import Link from "next/link";
import "./Menu.style.css";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

type MenuProps = {
  initialState: Category[];
};

export const Menu = ({ initialState }: MenuProps) => {
  const pathname = usePathname();
  return (
    <div className="menu">
      {initialState.length == 0 && "No categories found"}
      {initialState.map((category) => (
        <Link
          className={clsx("menu__item", {
            "menu__item--active": pathname === `/categories/${category.id}`,
          })}
          key={category.slug}
          href={`/categories/${category.id}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
