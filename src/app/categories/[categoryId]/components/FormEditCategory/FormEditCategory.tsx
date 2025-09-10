"use client";

import { updateCategoryByIdOrSlug } from "modules/categories/categories.api";
import { Category } from "modules/categories";
import { FormEvent, useState } from "react";

export default function FormEditCategory({
  initialState,
  id,
}: {
  initialState: Category;
  id: string;
}) {
  const [category, setCategory] = useState(initialState);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateCategoryByIdOrSlug(category, id);
    console.log("Editou");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="">Name</label>
      <input
        id="category-name"
        name="category-name"
        type="text"
        value={category.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
      />
      <label htmlFor="category-description">Description</label>
      <input
        id="category-description"
        name="category-description"
        type="text"
        value={category.description || ""}
        onChange={(e) => setCategory({ ...category, description: e.target.value })}
      />
      <label htmlFor="category-slug">Slug</label>
      <input
        id="category-slug"
        name="category-slug"
        type="text"
        value={category.slug}
        onChange={(e) => setCategory({ ...category, slug: e.target.value })}
      />
      <button type="submit">Save</button>
    </form>
  );
}
