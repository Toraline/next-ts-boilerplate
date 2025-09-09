import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import { getAllCategories } from "modules/categories/categories.api";

export default async function Page() {
  const categoriesData = await getAllCategories();

  return (
    <>
      <h1>Categories</h1>
      <CategoriesTable initialState={categoriesData?.items || []} loading={!categoriesData} />
      <Link href="/categories/new">Create Category</Link>
    </>
  );
}
