"use client";

import "./FormNewCategory.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "ui/Field/Field";
import { Button } from "global/ui";
import { TextArea } from "ui/TextArea";
import { errorMessages } from "constants/errors";

export default function FormNewCategory() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const newCategory = { name, slug, description };

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsSubmitting(false);
        return;
      }

      setSuccess(data.message);
      setIsSubmitting(false);
      setName("");
      setDescription("");
      setSlug("");
      router.push(`/categories/${slug}`);
    } catch (error) {
      console.error(error);
      setError(errorMessages.CREATE_CATEGORY_ERROR);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="title">New Category</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
