import { NextResponse } from "next/server";
import { assignPermissionToRole, listRolePermissions } from "modules/roles";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { roleId } = await params;
  const permissions = await listRolePermissions(roleId);
  return NextResponse.json(permissions);
});

export const POST = withActorFromSession(async (req, _auth, { params }) => {
  const { roleId } = await params;
  const payload = await req.json();
  const actor = getRequestAuditActor(req);
  const assignment = await assignPermissionToRole(roleId, payload, actor ? { actor } : undefined);
  return NextResponse.json(assignment, { status: 201 });
});
