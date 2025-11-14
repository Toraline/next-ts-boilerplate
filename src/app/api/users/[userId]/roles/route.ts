import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { userId } = await params;
  const roles = await userService.listUserRoles(userId);
  return NextResponse.json(roles);
});

export const POST = withActorFromSession(async (req, _auth, { params }) => {
  const { userId } = await params;
  const payload = await req.json();
  const actor = getRequestAuditActor(req);
  const assignment = await userService.assignRoleToUser(
    userId,
    payload,
    actor ? { actor } : undefined,
  );
  return NextResponse.json(assignment, { status: 201 });
});
