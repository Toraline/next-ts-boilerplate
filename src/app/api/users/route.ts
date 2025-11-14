import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (req) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const data = await userService.listUsers(queryParams);
  return NextResponse.json(data);
});

export const POST = withActorFromSession(async (req) => {
  const payload = await req.json();
  const actor = getRequestAuditActor(req);
  const created = await userService.createUser(payload, actor ? { actor } : undefined);
  return NextResponse.json(created, { status: 201 });
});
