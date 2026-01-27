import type { CollectionConfig } from "payload";

import { isSuperAdminAccess } from "@/access/isSuperAdmin";
import { superAdminOrTenantAdminAccess } from "./access/superAdminOrTenantAdmin";
import { ensureUniqueTenantName } from "./hooks/ensureUniqueName";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [ensureUniqueTenantName],
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "address",
      type: "text",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "bookingModel",
      type: "select",
      required: true,
      defaultValue: "single",
      options: [
        {
          label: "Single Service (1 Layanan per Booking)",
          value: "single",
        },
        {
          label:
            "Multi Select / Cart (Bisa pilih banyak layanan dalam 1 Booking)",
          value: "multi",
        },
      ],
    },
    {
      name: "operatingHours",
      type: "array",
      label: "Operating Hours",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "dayOfWeek",
              type: "select",
              required: true,
              options: [
                { label: "Minggu", value: "0" },
                { label: "Senin", value: "1" },
                { label: "Selasa", value: "2" },
                { label: "Rabu", value: "3" },
                { label: "Kamis", value: "4" },
                { label: "Jumat", value: "5" },
                { label: "Sabtu", value: "6" },
              ],
            },
            {
              name: "isClosed",
              type: "checkbox",
              label: "Closed",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "open",
              type: "text",
              label: "Open Time (HH:mm)",
              required: true,
              admin: {
                condition: (_, siblingData) => !siblingData.isClosed,
              },
            },
            {
              name: "close",
              type: "text",
              label: "Close Time (HH:mm)",
              required: true,
              admin: {
                condition: (_, siblingData) => !siblingData.isClosed,
              },
            },
          ],
        },
      ],
    },
    {
      name: "domain",
      type: "text",
      required: true,
    },
  ],
};
