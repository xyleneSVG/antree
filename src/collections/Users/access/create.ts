import type { Access } from "payload";
import type { Tenant, User } from "@/payload-types";

import { isSuperAdmin } from "@/access/isSuperAdmin";
import { getUserTenantIDs } from "@/utilities/getUserTenantIDs";

export const createAccess: Access<User> = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  if (req.data?.roles?.some((role: string) => role === "super-admin")) {
    return false;
  }

  const myAdminTenantIDs = getUserTenantIDs(req.user);

  if (myAdminTenantIDs.length === 0) {
    return false;
  }

  const requestedTenants = (req.data?.tenants || []).map((t: any) =>
    typeof t.tenant === "object" ? t.tenant.id : t.tenant,
  );

  if (requestedTenants.length === 0) {
    return false;
  }

  const isAllowed = requestedTenants.every((tenantID: number) =>
    myAdminTenantIDs.includes(tenantID),
  );

  return isAllowed;
};
