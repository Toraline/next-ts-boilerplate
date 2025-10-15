import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import { listCategories } from "modules/categories/server/service";
import "./page.style.css";

export default async function Page() {
  const categories = await listCategories();

  return (
    <span className="page">
      {categories.length > 0 ? (
        <>
          <h1>Categories</h1>
          <CategoriesTable initialState={categories || []} loading={!categories} />
          <Link href="/categories/new">Create Category</Link>
        </>
      ) : (
        <div className="no-content">
          <h1 className="no-content__title">No category selected</h1>
          <h3 className="no-content__subtitle">Select or create a new category</h3>
        </div>
      )}
    </span>
  );
}
