"use client";

import { postCategory } from "modules/categories/categories.api";
import "./FormNewCategory.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "ui/Field/Field";
import { Button } from "ui/Button/Button";
import { TextArea } from "ui/TextArea";

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
    <div className="form-container">
      <h1 className="title">New Category</h1>
      <form className="form-new-category" onSubmit={handleSubmit}>
        <div className="form-new-category__header">
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
        </div>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="category-description"
          id="category-description"
          placeholder="Enter the category description"
        />
        <div>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
