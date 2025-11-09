import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ userId: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const roles = await userService.listUserRoles(userId);
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const payload = await req.json();
    const actor = getRequestAuditActor(req);
    const assignment = await userService.assignRoleToUser(
      userId,
      payload,
      actor ? { actor } : undefined,
    );
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
