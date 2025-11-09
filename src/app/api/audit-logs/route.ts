import { NextResponse } from "next/server";
import { listAuditLogs } from "modules/audit";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const data = await listAuditLogs(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
