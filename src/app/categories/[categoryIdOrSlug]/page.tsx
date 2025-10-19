import CategoryContent from "./components/CategoryContent/CategoryContent";
import "./page.style.css";

export default async function Page({
  params,
}: {
  params: Promise<{ categoryIdOrSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryIdOrSlug } = await params;

  return <CategoryContent categoryIdOrSlug={categoryIdOrSlug} />;
}
