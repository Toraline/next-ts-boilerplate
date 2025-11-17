import { NextResponse } from "next/server";
import { createTask, listTasks } from "modules/tasks/server/service";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { UnauthorizedError } from "lib/http/errors";

export const runtime = "nodejs";

export const POST = withActorFromSession(async (request, auth) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const task = await request.json();

  const createdTask = await createTask(task, auth.actorUserId);
  return NextResponse.json(createdTask, { status: 201 });
});

export const GET = withActorFromSession(async (req, auth) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const data = await listTasks(queryParams, auth.actorUserId);

  return NextResponse.json(data);
});
