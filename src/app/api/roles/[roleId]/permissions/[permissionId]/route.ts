import { NextResponse } from "next/server";
import { removePermissionFromRole } from "modules/roles";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ roleId: string; permissionId: string }> };

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { roleId, permissionId } = await params;
    await removePermissionFromRole(roleId, permissionId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
