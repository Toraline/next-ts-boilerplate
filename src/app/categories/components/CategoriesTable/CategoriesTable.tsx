"use client";

import { Category } from "modules/categories";
import { deleteCategory } from "modules/categories/categories.api";
import Link from "next/link";
import { useState } from "react";

type CategoriesTableProps = {
  initialState: Category[];
  loading: boolean;
};

export default function CategoriesTable({ initialState, loading }: CategoriesTableProps) {
  const [categories, setCategories] = useState(initialState);
  const onDelete = async (slug) => {
    await deleteCategory(slug);
    const filteredCategories = categories.filter((categories) => categories.slug !== slug);
    setCategories(filteredCategories);
    console.log(filteredCategories);
  };
  return (
    <ul>
      {loading && "is loading..."}
      {categories.length == 0 && "No categories found"}
      {!loading &&
        categories.length > 0 &&
        categories.map((category) => (
          <li key={category.slug}>
            <p> {category.name}</p>
            <p> {category.slug}</p>
            <p>{category.description}</p>
            <Link href={`/categories/${category.slug}`}>Edit Category</Link>
            <button id="delete-button" type="button" onClick={() => onDelete(category.slug)}>
              Delete
            </button>
          </li>
        ))}
    </ul>
  );
}
