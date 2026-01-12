"use client";

import { AuthGuard } from "global/components/AuthGuard";
import EditStateRole from "modules/roles/components/EditStateRole/EditStateRole";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ roleId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { roleId } = use(params);

  return (
    <AuthGuard>
      <div className="flex-col flex pt-18 pl-41 pr-6 gap-15 max-w-xl">
        <EditStateRole roleId={roleId} />
      </div>
    </AuthGuard>
  );
}
