import { NextResponse } from "next/server";
import { deleteRole, getRoleById, updateRole } from "modules/roles";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ roleId: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { roleId } = await params;
    const role = await getRoleById(roleId);
    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { roleId } = await params;
    const payload = await req.json();
    const actor = getRequestAuditActor(req);
    const updated = await updateRole(roleId, payload, actor ? { actor } : undefined);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { roleId } = await params;
    const actor = getRequestAuditActor(req);
    await deleteRole(roleId, actor ? { actor } : undefined);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
