"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const onDelete = async (slug) => {
    setError(null);

    // eslint-disable-next-line
    if (!confirm("Are you sure you want to delete this category?")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/categories/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push(`/categories`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <ul>
      {loading && "is loading..."}
      Page: {page} of {totalPages}
      {items.length == 0 && "No categories found"}
      {!loading &&
        items.length > 0 &&
        items.map((item) => (
          <li key={item.slug}>
            <p> {item.name}</p>
            <p> {item.slug}</p>
            <p>{item.description}</p>
            <p>{item.createdAt}</p>
            <p>{item.updatedAt}</p>
            <Link href={`/categories/${item.slug}`}>Edit Category</Link>
            <button id="delete-button" type="button" onClick={() => onDelete(item.slug)}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            {error && <p>{error}</p>}
          </li>
        ))}
    </ul>
  );
}
