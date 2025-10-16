"use client";

import { deleteCategory } from "modules/categories/categories.api";
import Link from "next/link";
import { useState } from "react";

type CategoriesTableProps = {
  items: {
    id: string;
    slug: string;
    name: string;
    description?: string | null | undefined;
    createdAt: string;
    updatedAt: string;
  }[];
  loading: boolean;
  totalPages: number;
  page: number;
};

export default function CategoriesTable({
  items,
  loading,
  totalPages,
  page,
}: CategoriesTableProps) {
  const [categories, setCategories] = useState(items);
  const onDelete = async (slug) => {
    await deleteCategory(slug);
    const filteredCategories = categories.filter((categories) => categories.slug !== slug);
    setCategories(filteredCategories);
  };
  return (
    <ul>
      {loading && "is loading..."}
      Page: {page} of {totalPages}
      {categories.length == 0 && "No categories found"}
      {!loading &&
        categories.length > 0 &&
        categories.map((category) => (
          <li key={category.slug}>
            <p> {category.name}</p>
            <p> {category.slug}</p>
            <p>{category.description}</p>
            <p>{category.createdAt}</p>
            <p>{category.updatedAt}</p>
            <Link href={`/categories/${category.slug}`}>Edit Category</Link>
            <button id="delete-button" type="button" onClick={() => onDelete(category.slug)}>
              Delete
            </button>
          </li>
        ))}
    </ul>
  );
}
