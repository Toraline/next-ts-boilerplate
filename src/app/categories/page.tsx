import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import { listCategories } from "modules/categories/categories.service";
import "./styles/page.style.css";

export default async function Page() {
  const categories = await listCategories();

  return (
    <>
      <h1>Categories</h1>
      <CategoriesTable initialState={categories || []} loading={!categories} />
      <Link href="/categories/new">Create Category</Link>
      {categories.length === 0 && (
        <div className="menu">
          <h1 className="menu__item">No category selected</h1>
          <h3 className="menu__item menu__item--subtitle">Select or create a new category</h3>
        </div>
      )}
    </>
  );
}
