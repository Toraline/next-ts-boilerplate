import { use } from "react";

const getData = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  return true;
};

export default function Page({
  params,
}: {
  params: { slug: string; categoriaId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { categoriaId, slug } = params;
  use(getData());

  return (
    <h1>
      Categoria: {categoriaId} {slug}
    </h1>
  );
}
