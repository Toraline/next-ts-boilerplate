import { NextResponse } from "next/server";
import { createPermission, listPermissions } from "modules/permissions";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const data = await listPermissions(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const actor = getRequestAuditActor(req);
    const created = await createPermission(payload, actor ? { actor } : undefined);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
