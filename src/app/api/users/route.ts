import { NextResponse } from "next/server";
import * as userService from "modules/users/server/service";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const data = await userService.listUsers(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const created = await userService.createUser(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
