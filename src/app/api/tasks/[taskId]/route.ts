import { deleteTaskById, getTaskById, updateTaskById } from "modules/tasks/server/service";
import { NextResponse } from "next/server";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { UnauthorizedError } from "lib/http/errors";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, auth, { params }) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { taskId } = await params;

  const task = await getTaskById(taskId, auth.actorUserId);

  return NextResponse.json(task);
});

export const PATCH = withActorFromSession(async (req, auth, { params }) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { taskId } = await params;
  const json = await req.json();

  const updatedTask = await updateTaskById(taskId, json, auth.actorUserId);

  return NextResponse.json(updatedTask);
});

export const DELETE = withActorFromSession(async (_req, auth, { params }) => {
  if (auth.actorType !== "USER" || !auth.actorUserId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { taskId } = await params;
  await deleteTaskById(taskId, auth.actorUserId);

  return new Response(null, { status: 204 });
});
