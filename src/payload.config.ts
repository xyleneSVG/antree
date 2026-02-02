import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";

import { Tenants } from "./collections/Tenants";
import { Media } from "./collections/Media";
import Users from "./collections/Users";
import { Services } from "./collections/Services";
import { Schedules } from "./collections/Schedules";
import { Bookings } from "./collections/Bookings";

import { isSuperAdmin } from "./access/isSuperAdmin";

import { isTenantAdmin } from "./access/isTenantAdmin";

import type { Config } from "./payload-types";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    components: {
      beforeDashboard: ["src/components/admin/tenant-welcome#TenantWelcome"],
    },
  },
  collections: [Users, Tenants, Services, Schedules, Bookings, Media],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./payload.db",
    },
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    multiTenantPlugin<Config>({
      collections: {
        bookings: {},
        services: {},
        schedules: {},
      },
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) return true;
            return false;
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: true,
        
        arrayFieldAccess: {
          create: (args) => {
            if (isSuperAdmin(args.req.user)) return true;
            const { id, ...rest } = args;
            const numericId = typeof id === "string" ? Number(id) : id;
            const result = isTenantAdmin({ ...rest, id: numericId });
            return typeof result === "boolean" ? result : false;
          },
          update: (args) => {
            if (isSuperAdmin(args.req.user)) return true;
            const { id, ...rest } = args;
            const numericId = typeof id === "string" ? Number(id) : id;
            const result = isTenantAdmin({ ...rest, id: numericId });
            return typeof result === "boolean" ? result : false;
          },
        },
        rowFields: [
          {
            name: "roles",
            type: "select",
            defaultValue: ["staff"],
            hasMany: true,
            options: ["tenant-admin", "staff"],
            required: true,

            access: {
              update: (args) => {
                if (isSuperAdmin(args.req.user)) return true;

                const { id, ...rest } = args;
                const numericId = typeof id === "string" ? Number(id) : id;
                const result = isTenantAdmin({ ...rest, id: numericId });
                return typeof result === "boolean" ? result : false;
              },
            },
          },
        ],
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
});
