import { NextResponse } from "next/server";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { createTask } from "modules/tasks/server/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const task = await request.json();

    const createdTask = await createTask(task);
    return NextResponse.json(createdTask, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
  }
}
