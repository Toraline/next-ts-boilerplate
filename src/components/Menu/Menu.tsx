"use client";

import Link from "next/link";
import "./Menu.style.css";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

export const Menu = () => {
  const categories = [
    {
      name: "Daily",
    },
    {
      name: "Family",
    },
    {
      name: "Personal",
    },
    {
      name: "Study",
    },
  ];
  const pathname = usePathname();
  return (
    <div className="menu">
      {categories.map((categories) => (
        <Link className="menu__item" href="/categories/Personal">
          {categories.name}
        </Link>
      ))}
      <Link
        href="/categories/Work"
        className={clsx(
          {
            "menu__item menu__item--active": pathname === "/",
          },
          { menu__item: pathname !== "/categories/work" },
        )}
      >
        Work
      </Link>
    </div>
  );
};
