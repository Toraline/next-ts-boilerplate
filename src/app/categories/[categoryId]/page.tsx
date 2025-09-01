import FormEditCategory from "./components/FormEditCategory/FormEditCategory";
import { getCategoryByIdOrSlug } from "modules/categories";

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
    <>
      <h1>Categoria: {initialState.name}</h1>
      <FormEditCategory initialState={initialState} id={categoryId} />
    </>
  );
}
