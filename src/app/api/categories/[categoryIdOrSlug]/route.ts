import { NextResponse } from "next/server";
import {
  getCategoryByIdOrSlug,
  updateCategoryByIdOrSlug,
  deleteCategoryByIdOrSlug,
} from "modules/categories";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { UnauthorizedError } from "lib/http/errors";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, auth, { params }) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { categoryIdOrSlug } = await params;
  const category = await getCategoryByIdOrSlug(categoryIdOrSlug, auth.actorUserId);

  return NextResponse.json(category);
});

export const PATCH = withActorFromSession(async (req, auth, { params }) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { categoryIdOrSlug } = await params;
  const json = await req.json();
  const updatedCategory = await updateCategoryByIdOrSlug(categoryIdOrSlug, json, auth.actorUserId);
  return NextResponse.json(updatedCategory);
});

export const DELETE = withActorFromSession(async (_req, auth, { params }) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { categoryIdOrSlug } = await params;
  await deleteCategoryByIdOrSlug(categoryIdOrSlug, auth.actorUserId);
  return new Response(null, { status: 204 });
});
