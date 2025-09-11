"use client";

import { postCategory } from "modules/categories/categories.api";
import "./FormNewCategory.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function FormNewCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newCategory = { name, slug, description };
    await postCategory(newCategory);
    setName("");
    setDescription("");
    setSlug("");
    router.push("/categories");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="category-name">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="category-name"
        id="category-name"
        type="text"
        placeholder="Enter the name of the category"
        required
      />
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        name="category-slug"
        id="category-slug"
        type="text"
        placeholder="Enter the slug of the category"
        required
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        name="category-description"
        id="category-description"
        type="text"
        placeholder="Enter the category description"
      ></input>
      <button type="submit">Submit</button>
    </form>
  );
}
