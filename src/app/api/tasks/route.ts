import { NextResponse } from "next/server";
import { createTask, listTasks } from "modules/tasks/server/service";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const POST = withActorFromSession(async (request) => {
  const task = await request.json();

  const createdTask = await createTask(task);
  return NextResponse.json(createdTask, { status: 201 });
});

export const GET = withActorFromSession(async (req) => {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const data = await listTasks(queryParams);

  return NextResponse.json(data);
});
