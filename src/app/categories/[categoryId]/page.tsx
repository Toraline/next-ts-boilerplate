import { getCategoryByIdOrSlug } from "modules/categories";
import { DeleteCategory } from "./components/DeleteCategory/DeleteCategory";
import { Button } from "ui/Button/Button";
import EditState from "./components/EditState/EditState";

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
      <div className="page__header">
        <h1 className="page__header-title"> {initialState.name}</h1>
        <div className="page__header-buttons">
          <DeleteCategory slug={initialState.slug} />
          <EditState initialState={initialState} id={categoryId} />
        </div>
      </div>
      <div className="page__body">
        <div className="page__body-title"> Tasks </div>
        <Button size="sm">New task</Button>
      </div>
    </div>
  );
}
