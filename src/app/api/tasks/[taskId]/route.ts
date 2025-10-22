import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getTaskById } from "modules/tasks/server/service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ taskId: string }> };

export async function GET(_r: Request, { params }: RouteParams) {
  try {
    const { taskId } = await params;

    const task = await getTaskById(taskId);

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
