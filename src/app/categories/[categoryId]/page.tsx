import { getCategoryByIdOrSlug } from "modules/categories";
import { DeleteCategory } from "./components/DeleteCategory/DeleteCategory";
import { Button } from "global/ui";
import EditState from "./components/EditState/EditState";
import "./page.style.css";
import { Tasks } from "./components/Tasks/Tasks";

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryId } = await params;
  const category = await getCategoryByIdOrSlug(categoryId);
  const initialState = category || {
    name: "",
    slug: "",
    description: "",
  };

  return (
    <div className="category-wrapper">
      <EditState initialState={initialState} id={categoryId} slug={initialState.slug} />

      <div className="task-wrapper">
        <Tasks />
      </div>
    </div>
  );
}
