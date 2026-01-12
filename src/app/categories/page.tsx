"use client";

import { AuthGuard } from "global/components/AuthGuard";
import { CategoriesListView } from "modules/categories";

export default function Page() {
  return (
    <AuthGuard>
      <CategoriesListView />
    </AuthGuard>
  );
}
