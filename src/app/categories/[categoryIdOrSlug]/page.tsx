import { CategoryContent } from "modules/categories";

export default async function Page({
  params,
}: {
  params: Promise<{ categoryIdOrSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryIdOrSlug } = await params;

  return <CategoryContent categoryIdOrSlug={categoryIdOrSlug} />;
}
