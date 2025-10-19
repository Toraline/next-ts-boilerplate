import Link from "next/link";
import CategoriesTable from "./components/CategoriesTable/CategoriesTable";
import "./page.style.css";
import { API_URL } from "lib/constants";

type ListResponse = {
  items: {
    id: string;
    slug: string;
    name: string;
    description?: string | null | undefined;
    createdAt: string;
    updatedAt: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
};

async function getCategories(searchParams: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams();
  if (typeof searchParams.search === "string") qs.set("search", searchParams.search);
  if (typeof searchParams.page === "string") qs.set("page", searchParams.page);
  if (typeof searchParams.pageSize === "string") qs.set("pageSize", searchParams.pageSize);
  // defaults handled by server schema
  const res = await fetch(`${API_URL}/categories?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load categories");
  return (await res.json()) as ListResponse;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsResolved = await searchParams;
  const categoriesResponse = await getCategories(searchParamsResolved);

  const { items, total, page, pageSize } = categoriesResponse;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const loading = !categoriesResponse;

  return (
    <span className="page">
      {items.length > 0 ? (
        <>
          <h1>Categories</h1>
          Pages: {page} of {totalPages}
          <form action="/categories" className="flex gap-2">
            <input
              name="search"
              defaultValue={
                typeof searchParamsResolved?.search === "string" ? searchParamsResolved?.search : ""
              }
              placeholder="Search by name/slug/description"
              className="border rounded p-2 w-full"
            />
            <button className="border rounded px-3">Search</button>
          </form>
          <CategoriesTable items={items} loading={loading} totalPages={totalPages} page={page} />
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
