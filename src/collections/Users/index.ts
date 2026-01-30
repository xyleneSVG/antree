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
    group: "Resource Settings",
    defaultColumns: ["email", "username"],
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
      name: "roles",
      type: "select",
      defaultValue: [],
      hasMany: true,
      options: ["super-admin"],
      admin: {
        condition: ({ user }) => isSuperAdmin(user),
      },
      access: {
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        read: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "username",
      type: "text",
      hooks: {
        beforeValidate: [ensureUniqueUsername],
      },
      index: true,
    },

    {
      name: "specialty",
      type: "text",
      admin: {
        condition: (data) => {
          return !data?.roles?.includes("super-admin");
        },
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
  ],
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
};

export default Users;
