import EditStateRole from "modules/roles/components/EditStateRole/EditStateRole";

export default async function Page({
  params,
}: {
  params: Promise<{ roleId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { roleId } = await params;
  return (
    <div className="flex-col flex pt-18 pl-41 pr-6 gap-15 max-w-xl">
      <EditStateRole roleId={roleId} />
    </div>
  );
}
