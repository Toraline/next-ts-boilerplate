import { NextResponse } from "next/server";
import { deletePermission, getPermissionById, updatePermission } from "modules/permissions";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

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
    const updated = await updatePermission(permissionId, payload);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { permissionId } = await params;
    await deletePermission(permissionId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
