"use client";

import { Category } from "modules/categories";
import Link from "next/link";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

type MenuProps = {
  initialState: Category[];
};

export const Menu = ({ initialState }: MenuProps) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col py-1 w-64 text-neutral-400 text-base">
      {initialState.length == 0 && "No categories found"}
      {initialState.map((category) => (
        <Link
          className={clsx(
            "text-black text-base font-medium py-2 px-4 hover:rounded-sm hover:bg-neutral-200",
            {
              "bg-neutral-100 rounded-md": pathname === `/categories/${category.id}`,
            },
          )}
          key={category.slug}
          href={`/categories/${category.id}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
