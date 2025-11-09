import { NextResponse } from "next/server";
import { createRole, listRoles } from "modules/roles";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const data = await listRoles(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const created = await createRole(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
