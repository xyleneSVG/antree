import type { Access } from "payload";

import { isSuperAdmin } from "../../../access/isSuperAdmin";

export const canMutateTenant: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  return {
    id: {
      in:
        req.user?.tenants
          ?.map(({ roles, tenant }) =>
            roles?.includes("tenant-admin")
              ? tenant &&
                (typeof tenant === "string"
                  ? tenant
                  : typeof tenant === "object"
                    ? tenant.id
                    : tenant)
              : null,
          )
          .filter(Boolean) || [],
    },
  };
};
