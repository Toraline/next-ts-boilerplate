"use client";

import { updateCategoryByIdOrSlug } from "modules/categories/categories.api";
import { Category } from "modules/categories";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "ui/Button/Button";
import { Field } from "ui/Field";
import { TextArea } from "ui/TextArea";
import "./FormEditCategory.style.css";

export default function FormEditCategory({
  initialState,
  id,
}: {
  initialState: Category;
  id: string;
}) {
  const [category, setCategory] = useState(initialState);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateCategoryByIdOrSlug(category, id);
    router.push(`/categories/${category.slug}`);
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__header">
          <Field
            label="Name"
            id="category-name"
            type="text"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
          <Field
            label="Slug"
            id="category-slug"
            name="category-slug"
            type="text"
            value={category.slug}
            onChange={(e) => setCategory({ ...category, slug: e.target.value })}
          />
        </div>
        <TextArea
          id={"description"}
          label="Description"
          placeholder={category.name + " description"}
        />
        <div>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
