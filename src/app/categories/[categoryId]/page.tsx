import { getCategoryByIdOrSlug } from "modules/categories";
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
    <div className="category">
      <div>
        <EditState initialState={initialState} id={categoryId} slug={initialState.slug} />
      </div>
      <div className="task">
        <Tasks />
      </div>
    </div>
  );
}
