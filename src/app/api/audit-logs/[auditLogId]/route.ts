import { NextResponse } from "next/server";
import { getAuditLogById } from "modules/audit";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { auditLogId } = await params;
  const log = await getAuditLogById(auditLogId);
  return NextResponse.json(log);
});
