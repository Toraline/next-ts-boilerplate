import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ userId: string; roleId: string }> };

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { userId, roleId } = await params;
    const actor = getRequestAuditActor(req);
    await userService.removeRoleFromUser(userId, roleId, actor ? { actor } : undefined);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
