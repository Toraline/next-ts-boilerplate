"use client";

import { AuthGuard } from "global/components/AuthGuard";
import { FormNewPermission } from "modules/permissions/components/FormNewPermission/FormNewPermission";

export default function Page() {
  return (
    <AuthGuard>
      <div>
        <h1>My public Page</h1>
        <FormNewPermission />
      </div>
    </AuthGuard>
  );
}
