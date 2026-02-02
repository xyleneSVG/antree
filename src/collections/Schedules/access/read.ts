import type { Access, Where } from "payload";
import { getTenantFromCookie } from "@payloadcms/plugin-multi-tenant/utilities";

import { isSuperAdmin } from "@/access/isSuperAdmin";
import { getUserTenantIDs } from "@/utilities/getUserTenantIDs";
import { getCollectionIDType } from "@/utilities/getCollectionIDType";

export const schedulesReadAccess: Access = ({ req }) => {
  const { user } = req;

  if (!user) return false;

  if (isSuperAdmin(user)) return true;

  const adminTenantAccessIDs = getUserTenantIDs(user, "tenant-admin");

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({
      payload: req.payload,
      collectionSlug: "tenants",
    }),
  );

  if (selectedTenant) {
    return {
      "resource.tenants.tenant": {
        equals: selectedTenant,
      },
    };
  }

  return {
    "resource.tenants.tenant": {
      in: adminTenantAccessIDs,
    },
  } as Where;
};
