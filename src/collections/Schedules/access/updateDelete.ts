import type { Access } from "payload";
import { isSuperAdmin } from "@/access/isSuperAdmin";

export const schedulesUpdateAccess: Access = async ({ req, id }) => {
  const { user } = req;

  if (!user) return false;
  if (!id) return false;

  if (isSuperAdmin(user)) return true;

  const schedule = await req.payload.findByID({
    collection: "schedules",
    id,
    depth: 0,
  });

  if (!schedule) return false;

  const resourceId =
    typeof schedule.resource === "number"
      ? schedule.resource
      : schedule.resource?.id;

  return resourceId === user.id;
};
