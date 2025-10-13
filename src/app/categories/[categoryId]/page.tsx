import { getCategoryByIdOrSlug } from "modules/categories";
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
    <div className="category">
      <div>
        <EditState initialState={initialState} id={categoryId} slug={initialState.slug} />
      </div>
      <div className="page__content">
        <div className="subtitle"> Tasks </div>
        <Button size="sm">New task</Button>
      </div>
    </div>
  );
}
