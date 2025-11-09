import { NextResponse } from "next/server";
import { removePermissionFromRole } from "modules/roles";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ roleId: string; permissionId: string }> };

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { roleId, permissionId } = await params;
    const actor = getRequestAuditActor(req);
    await removePermissionFromRole(roleId, permissionId, actor ? { actor } : undefined);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
