import { NextResponse } from "next/server";
import { assignPermissionToRole, listRolePermissions } from "modules/roles";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ roleId: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { roleId } = await params;
    const permissions = await listRolePermissions(roleId);
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { roleId } = await params;
    const payload = await req.json();
    const assignment = await assignPermissionToRole(roleId, payload);
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
