import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import { listCategories } from "modules/categories/categories.service";

export default async function Page() {
  const categories = await listCategories();

  return (
    <>
      <h1>Categories</h1>
      <CategoriesTable initialState={categories || []} loading={!categories} />
      <Link href="/categories/new">Create Category</Link>
    </>
  );
}
