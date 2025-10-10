import { getCategoryByIdOrSlug } from "modules/categories";
import { DeleteCategory } from "./components/DeleteCategory/DeleteCategory";
import { Button } from "ui/Button/Button";
import EditState from "./components/EditState/EditState";
import "./page.style.css";

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
    <div className="page">
      <div className="header ">
        <div className="category-header">
          <div>
            <h1 className="title"> {initialState.name}</h1>
          </div>
          <div className="category-buttons">
            <EditState initialState={initialState} id={categoryId} />
            <DeleteCategory slug={initialState.slug} />
          </div>
        </div>
      </div>
      <div className="page__content">
        <div className="subtitle"> Tasks </div>
        <Button size="sm">New task</Button>
      </div>
    </div>
  );
}
