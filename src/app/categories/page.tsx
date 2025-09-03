"use client";

import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";

export default function Page() {
  const categories = [{ name: "Categoria 1", slug: "categoria1" }];
  const isLoading = false;
  return (
    <>
      <h1>Categories</h1>
      <CategoriesTable categories={categories} loading={isLoading} />
      <Link href="/categories/new">Create Category</Link>
      {/* <Link href="/categories/categoryId">Edit Category</Link> */}
    </>
  );
}
