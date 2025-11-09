import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ userId: string; roleId: string }> };

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { userId, roleId } = await params;
    await userService.removeRoleFromUser(userId, roleId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
