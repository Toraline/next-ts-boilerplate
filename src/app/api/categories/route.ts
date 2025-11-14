import { NextResponse } from "next/server";
import { createCategory, listCategories } from "modules/categories";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (req) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const data = await listCategories(queryParams);

  return NextResponse.json(data);
});

export const POST = withActorFromSession(async (req) => {
  const json = await req.json();
  const created = await createCategory(json);

  return NextResponse.json(created, { status: 201 });
});
