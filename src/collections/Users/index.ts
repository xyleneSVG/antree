import type { CollectionConfig } from "payload";

import { createAccess } from "./access/create";
import { readAccess } from "./access/read";
import { updateAndDeleteAccess } from "./access/updateAndDelete";
import { externalUsersLogin } from "./endpoints/externalUsersLogin";
import { ensureUniqueUsername } from "./hooks/ensureUniqueUsername";
import { isSuperAdmin } from "@/access/isSuperAdmin";
import { setCookieBasedOnDomain } from "./hooks/setCookieBasedOnDomain";

const Users: CollectionConfig = {
  slug: "users",
  access: {
    create: createAccess,
    delete: updateAndDeleteAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  endpoints: [externalUsersLogin],
  fields: [
    {
      type: "text",
      name: "password",
      hidden: true,
      access: {
        read: () => false,
        update: ({ req, id }) => {
          const { user } = req;
          if (!user) return false;
          if (id === user.id) return true;
          return isSuperAdmin(user);
        },
      },
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        update: async ({ req }) => {
          if (isSuperAdmin(req.user)) return true;
          if (!req.user) {
            const count = await req.payload.count({ collection: "users" });
            return count.totalDocs === 0;
          }
          return false;
        },
      },
    },
    {
      name: "username",
      type: "text",
      hooks: {
        beforeValidate: [ensureUniqueUsername],
      },
      index: true,
      admin: {
        condition: (data) => {
          return data?.roles?.includes("user");
        },
      },
    },
    {
      name: "specialty",
      type: "text",
      admin: {
        condition: (data) => {
          return data?.roles?.includes("user");
        },
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        condition: (data) => {
          return data?.roles?.includes("user");
        },
      },
    },
  ],
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
};

export default Users;
