import { NextResponse } from "next/server";
import { deleteRole, getRoleById, updateRole } from "modules/roles";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { roleId } = await params;
  const role = await getRoleById(roleId);
  return NextResponse.json(role);
});

export const PATCH = withActorFromSession(async (req, _auth, { params }) => {
  const { roleId } = await params;
  const payload = await req.json();
  const actor = getRequestAuditActor(req);
  const updated = await updateRole(roleId, payload, actor ? { actor } : undefined);
  return NextResponse.json(updated);
});

export const DELETE = withActorFromSession(async (req, _auth, { params }) => {
  const { roleId } = await params;
  const actor = getRequestAuditActor(req);
  await deleteRole(roleId, actor ? { actor } : undefined);
  return new Response(null, { status: 204 });
});
