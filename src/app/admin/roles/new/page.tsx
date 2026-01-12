"use client";

import { AuthGuard } from "global/components/AuthGuard";
import { FormNewRole } from "modules/roles/components/FormNewRole/FormNewRole";

export default function Page() {
  return (
    <AuthGuard>
      <div>
        <FormNewRole />
      </div>
    </AuthGuard>
  );
}
