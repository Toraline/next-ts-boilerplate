"use client";

import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1>Categories</h1>
      <Link href="/categories/new">Create Category</Link>
      {/* <Link href="/categories/categoryId">Edit Category</Link> */}
    </>
  );
}
