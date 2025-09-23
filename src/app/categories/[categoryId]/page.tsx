// import FormEditCategory from "./components/FormEditCategory/FormEditCategory";
import { getCategoryByIdOrSlug } from "modules/categories";
import "./styles/page.style.css";
import { Button } from "ui/Button/Button";
import { Edit } from "ui/Icons/Edit";
import { Delete } from "ui/Icons/Delete";

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
        <div className="page__header-icons">
          <Button variant="transparent">
            <Edit />
          </Button>
          <Button variant="transparent">
            <Delete />
          </Button>
        </div>
      </div>
      <div className="page__body">
        <div className="page__body-title"> Tasks </div>
        <Button size="sm">New task</Button>
      </div>

      {/* <FormEditCategory initialState={initialState} id={categoryId} /> */}
    </div>
  );
}
