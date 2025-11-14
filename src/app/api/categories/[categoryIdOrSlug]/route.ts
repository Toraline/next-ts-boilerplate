import { NextResponse } from "next/server";
import {
  getCategoryByIdOrSlug,
  updateCategoryByIdOrSlug,
  deleteCategoryByIdOrSlug,
} from "modules/categories";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { categoryIdOrSlug } = await params;
  const category = await getCategoryByIdOrSlug(categoryIdOrSlug);

  return NextResponse.json(category);
});

export const PATCH = withActorFromSession(async (req, _auth, { params }) => {
  const { categoryIdOrSlug } = await params;
  const json = await req.json();
  const updatedCategory = await updateCategoryByIdOrSlug(categoryIdOrSlug, json);
  return NextResponse.json(updatedCategory);
});

export const DELETE = withActorFromSession(async (_req, _auth, { params }) => {
  const { categoryIdOrSlug } = await params;
  await deleteCategoryByIdOrSlug(categoryIdOrSlug);
  return new Response(null, { status: 204 });
});
