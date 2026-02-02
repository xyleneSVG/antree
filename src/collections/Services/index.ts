import { isTenantAdmin } from "@/access/isTenantAdmin";
import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "isActive"],
    group: "Platform Settings",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user), 
    create: isTenantAdmin,
    update: isTenantAdmin,
    delete: isTenantAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      type: "row",
      fields: [
        {
          name: "durationMinutes",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: "category",
      type: "text",
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
