import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ userId: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const user = await userService.getUser({ id: userId });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const payload = await req.json();
    const updated = await userService.updateUser(userId, payload);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { userId } = await params;
    await userService.deleteUser(userId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
