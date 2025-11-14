import { deleteTaskById, getTaskById, updateTaskById } from "modules/tasks/server/service";
import { NextResponse } from "next/server";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const GET = withActorFromSession(async (_req, _auth, { params }) => {
  const { taskId } = await params;

  const task = await getTaskById(taskId);

  return NextResponse.json(task);
});

export const PATCH = withActorFromSession(async (req, _auth, { params }) => {
  const { taskId } = await params;
  const json = await req.json();

  const updatedTask = await updateTaskById(taskId, json);

  return NextResponse.json(updatedTask);
});

export const DELETE = withActorFromSession(async (_req, _auth, { params }) => {
  const { taskId } = await params;
  await deleteTaskById(taskId);

  return new Response(null, { status: 204 });
});
