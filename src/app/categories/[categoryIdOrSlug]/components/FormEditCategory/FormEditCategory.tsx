"use client";

import { Category } from "modules/categories";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "global/ui";
import { Field } from "ui/Field";
import { TextArea } from "ui/TextArea";
import "./FormEditCategory.style.css";
import { API_URL } from "lib/constants";

export default function FormEditCategory({
  initialState,
  id,
}: {
  initialState: Category;
  id: string;
}) {
  const [category, setCategory] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const patch: Record<string, unknown> = {};

      if (category.name.trim().length > 0) patch.name = category.name.trim();
      patch.slug = category.slug;
      patch.description = category.description;

      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error);
      }

      router.push(`/categories/${data.slug}`);
      setSaving(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");

      setSaving(false);
    }
  }

  return (
    <div className="form-container">
      {error && <div className="error">{error}</div>}
      {saving && <div className="saving">Saving...</div>}
      <form className="form" onSubmit={onSubmit}>
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
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
