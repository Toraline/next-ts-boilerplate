"use client";

import { AuthGuard } from "global/components/AuthGuard";
import { CategoryContent } from "modules/categories";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ categoryIdOrSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryIdOrSlug } = use(params);

  return (
    <AuthGuard>
      <CategoryContent categoryIdOrSlug={categoryIdOrSlug} />
    </AuthGuard>
  );
}
