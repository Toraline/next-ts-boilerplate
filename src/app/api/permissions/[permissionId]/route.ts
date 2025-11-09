import { NextResponse } from "next/server";
import { deletePermission, getPermissionById, updatePermission } from "modules/permissions";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ permissionId: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { permissionId } = await params;
    const permission = await getPermissionById(permissionId);
    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { permissionId } = await params;
    const payload = await req.json();
    const actor = getRequestAuditActor(req);
    const updated = await updatePermission(permissionId, payload, actor ? { actor } : undefined);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { permissionId } = await params;
    const actor = getRequestAuditActor(req);
    await deletePermission(permissionId, actor ? { actor } : undefined);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
