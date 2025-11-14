import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { userId } = await params;
  const user = await userService.getUser({ id: userId });
  return NextResponse.json(user);
});

export const PATCH = withActorFromSession(async (req, _auth, { params }) => {
  const { userId } = await params;
  const payload = await req.json();
  const actor = getRequestAuditActor(req);
  const updated = await userService.updateUser(userId, payload, actor ? { actor } : undefined);
  return NextResponse.json(updated);
});

export const DELETE = withActorFromSession(async (req, _auth, { params }) => {
  const { userId } = await params;
  const actor = getRequestAuditActor(req);
  await userService.deleteUser(userId, actor ? { actor } : undefined);
  return new Response(null, { status: 204 });
});
