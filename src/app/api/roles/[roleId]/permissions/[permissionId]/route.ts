import { removePermissionFromRole } from "modules/roles";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const DELETE = withActorFromSession(async (req, _auth, { params }) => {
  const { roleId, permissionId } = await params;
  // The route uses permissionId but the service expects permissionKey
  // Since permissions are identified by key in the API, we use permissionId as the key
  const actor = getRequestAuditActor(req);
  await removePermissionFromRole(roleId, permissionId, actor ? { actor } : undefined);
  return new Response(null, { status: 204 });
});
