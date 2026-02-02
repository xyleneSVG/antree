import { getUserTenantIDs } from "@/utilities/getUserTenantIDs";
import { isSuperAdmin } from "../../../access/isSuperAdmin";
import { Access } from "payload";

export const superAdminOrTenantAdminAccess: Access = ({ req, id }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, "tenant-admin");

  if (id) {
    return adminTenantAccessIDs.includes(
      typeof id === "string" ? parseInt(id, 10) : id,
    );
  }

  return {
    id: {
      in: adminTenantAccessIDs,
    },
  };
};
