"use client";

import { AuthGuard } from "global/components/AuthGuard";
import RolesListView from "modules/roles/views/RolesListView";

export default function Page() {
  return (
    <AuthGuard>
      <div>
        <RolesListView />
      </div>
    </AuthGuard>
  );
}
