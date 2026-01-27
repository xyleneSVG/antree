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
  collections: [
    Tenants,
    Users,
    Services,
    Schedules,
    Bookings,
    Media,
  ],
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
        users: {},
        media: {},
        schedules: {},
      },
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true;
            }
            return false;
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: true,
        rowFields: [
          {
            name: "roles",
            type: "select",
            defaultValue: ["tenant-viewer"],
            hasMany: true,
            options: ["tenant-admin", "tenant-viewer"],
            required: true,
            access: {
              update: ({ req }) => {
                const { user } = req;
                if (!user) {
                  return false;
                }

                if (isSuperAdmin(user)) {
                  return true;
                }

                return true;
              },
            },
          },
        ],
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
});
