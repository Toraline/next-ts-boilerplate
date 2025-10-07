import { getCategoryByIdOrSlug } from "modules/categories";
import { Button } from "ui/Button/Button";
import { Delete } from "ui/Icons/Delete";
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
    <div className="page__container">
      <div className="page__header">
        <h1 className="page__header-title"> {initialState.name}</h1>
        <div className="page__header-buttons">
          <EditState initialState={initialState} id={categoryId} />
          <Button variant="transparent">
            <Delete />
          </Button>
        </div>
      </div>
      <div className="page__body">
        <div className="page__body-title"> Tasks </div>
        <Button size="sm">New task</Button>
      </div>
    </div>
  );
}
