import type { Access } from "payload";
import type { User } from "@/payload-types";

import { isSuperAdmin } from "@/access/isSuperAdmin";
import { getUserTenantIDs } from "@/utilities/getUserTenantIDs";

export const createAccess: Access<User> = ({ req }) => {
  const { user } = req;

  if (!user) return false;

  if (isSuperAdmin(user)) return true;

  const isTenantAdmin = user.tenants?.some((t) =>
    t.roles?.includes("tenant-admin"),
  );

  if (isTenantAdmin) {
    return {
      "tenants.tenant": {
        in: getUserTenantIDs(user, "tenant-admin"),
      },
    };
  }

  return false;
};
