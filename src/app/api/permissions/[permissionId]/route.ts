import { NextResponse } from "next/server";
import { deletePermission, getPermissionById, updatePermission } from "modules/permissions";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { permissionId } = await params;
  const permission = await getPermissionById(permissionId);
  return NextResponse.json(permission);
});

export const PATCH = withActorFromSession(async (req, _auth, { params }) => {
  const { permissionId } = await params;
  const payload = await req.json();
  const actor = getRequestAuditActor(req);
  const updated = await updatePermission(permissionId, payload, actor ? { actor } : undefined);
  return NextResponse.json(updated);
});

export const DELETE = withActorFromSession(async (req, _auth, { params }) => {
  const { permissionId } = await params;
  const actor = getRequestAuditActor(req);
  await deletePermission(permissionId, actor ? { actor } : undefined);
  return new Response(null, { status: 204 });
});
