import { NextResponse } from "next/server";
import { createCategory, listCategories } from "modules/categories";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { UnauthorizedError } from "lib/http/errors";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (req, auth) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const data = await listCategories(queryParams, auth.actorUserId);

  return NextResponse.json(data);
});

export const POST = withActorFromSession(async (req, auth) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const json = await req.json();
  const created = await createCategory(json, auth.actorUserId);

  return NextResponse.json(created, { status: 201 });
});
