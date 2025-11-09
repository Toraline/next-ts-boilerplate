import { NextResponse } from "next/server";
import { getAuditLogById } from "modules/audit";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ auditLogId: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { auditLogId } = await params;
    const log = await getAuditLogById(auditLogId);
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
