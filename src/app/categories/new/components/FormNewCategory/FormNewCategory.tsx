"use client";

import { postCategory } from "modules/categories/categories.api";
import "./FormNewCategory.css";
import { FormEvent, useState } from "react";

export default function FormNewCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newCategory = { name, slug, description };
    const savedCategory = await postCategory(newCategory);
    console.log(savedCategory);
    setName("");
    setDescription("");
    setSlug("");
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
        placeholder="Escreva o nome da categoria"
        required
      />
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        name="category-slug"
        id="category-slug"
        type="text"
        placeholder="Escreva o nome do atalho"
        required
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        name="category-description"
        id="category-description"
        type="text"
        placeholder="Escreva a descrição da categoria"
      ></input>
      <button type="submit">Submit</button>
    </form>
  );
}
