"use client";

import { postCategory } from "modules/categories/categories.api";
import "./FormNewCategory.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "ui/Field/Field";
import { Button } from "ui/Button/Button";

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
    router.push(`/categories/${slug}`);
  };

  return (
    <form className="form-new-category" onSubmit={handleSubmit}>
      <span className="form__header">
        <Field
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="category-name"
          id="category-name"
          type="text"
          placeholder="Enter the name of the category"
          required
        />
        <Field
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          name="category-slug"
          id="category-slug"
          type="text"
          placeholder="Enter the slug of the category"
          required
        />
      </span>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        name="category-description"
        id="category-description"
        placeholder="Enter the category description"
      ></textarea>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
