import type { Access } from "payload";
import { isSuperAdmin } from "./isSuperAdmin";

export const isTenantAdmin: Access = ({ req }) => {
  const user = req.user;

  if (!user) return false;

  if (isSuperAdmin(user)) return true;

  const hasAdminRole = user.tenants?.some((t: any) =>
    t.roles?.includes("tenant-admin"),
  );

  return Boolean(hasAdminRole);
};
