import EditState from "./components/EditState/EditState";
import "./page.style.css";
import { Tasks } from "./components/Tasks/Tasks";
import { API_URL } from "lib/constants";

type CategoryPublic = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

async function getCategory(categoryIdOrSlug: string): Promise<CategoryPublic> {
  const res = await fetch(`${API_URL}/categories/${categoryIdOrSlug}`, { cache: "no-store" });
  if (!res.ok) {
    let msg = `Failed to load category (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg += `: ${j.error}`;
    } catch {
      throw new Error(msg);
    }
  }
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ categoryIdOrSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryIdOrSlug } = await params;
  const category = await getCategory(categoryIdOrSlug);
  const initialState = category || {
    name: "",
    slug: "",
    description: "",
  };

  return (
    <div className="category-wrapper">
      <EditState initialState={initialState} id={categoryIdOrSlug} slug={initialState.slug} />
      <div className="task-wrapper">
        <Tasks />
      </div>
    </div>
  );
}
