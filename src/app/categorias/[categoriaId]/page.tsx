const getData = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  return true;
};

export default async function Page({
  params,
}: {
  params: { slug: string; categoriaId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { categoriaId, slug } = await params;
  await getData();

  return (
    <h1>
      Categoria: {categoriaId} {slug}
    </h1>
  );
}
