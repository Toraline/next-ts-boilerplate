import { EditStatePermission } from "modules/permissions";
export default async function Page({
  params,
}: {
  params: Promise<{ permissionId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { permissionId } = await params;

  return (
    <div className="flex-col flex pt-18 pl-41 pr-6 gap-15 max-w-xl">
      <EditStatePermission permissionId={permissionId} />
    </div>
  );
}
