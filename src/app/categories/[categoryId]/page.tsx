const getData = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  return true;
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; categoyId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoyId, slug } = await params;
  await getData();

  return (
    <h1>
      Categoria: {categoyId} {slug}
    </h1>
  );
}
