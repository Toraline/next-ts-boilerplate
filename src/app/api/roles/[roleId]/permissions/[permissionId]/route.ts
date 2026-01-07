import { removePermissionFromRole } from "modules/roles";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const DELETE = withActorFromSession(async (req, _auth, { params }) => {
  const { roleId, permissionKey } = await params;
  const actor = getRequestAuditActor(req);
  await removePermissionFromRole(roleId, permissionKey, actor ? { actor } : undefined);
  return new Response(null, { status: 204 });
});
