"use client";

import { AuthGuard } from "global/components/AuthGuard";
import PermissionsListView from "modules/permissions/components/Permissions/views/PermissionsListView";
import { PERMISSIONS_UI } from "modules/permissions/constants/ui";

export default function Page() {
  return (
    <AuthGuard>
      <div>
        <h1>{PERMISSIONS_UI.HEADERS.PERMISSIONS}</h1>
        <PermissionsListView />
      </div>
    </AuthGuard>
  );
}
