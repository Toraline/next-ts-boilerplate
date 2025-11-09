import { NextResponse } from "next/server";
import { deleteRole, getRoleById, updateRole } from "modules/roles";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

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
    const updated = await updateRole(roleId, payload);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { roleId } = await params;
    await deleteRole(roleId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
