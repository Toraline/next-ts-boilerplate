import { NextResponse } from "next/server";
import { listAuditLogs } from "modules/audit";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (req) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const data = await listAuditLogs(queryParams);
  return NextResponse.json(data);
});
