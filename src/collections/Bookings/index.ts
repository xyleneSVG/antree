import type { CollectionConfig } from "payload";

export const Bookings: CollectionConfig = {
  slug: "bookings",
  admin: {
    defaultColumns: ["bookingCode", "bookingDate", "customer.name", "status"],
    useAsTitle: "bookingCode",
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "bookingCode",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      access: {
        update: () => false,
      },
    },
    {
      name: "bookingActions",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field:
            "src/collections/Bookings/components/booking-actions#BookingActions",
        },
      },
    },
    {
      name: "resource",
      type: "relationship",
      relationTo: "users",
      required: true,
      access: {
        update: () => false,
      },
    },
    {
      name: "service",
      type: "relationship",
      relationTo: "services",
      required: true,
      access: {
        update: () => false,
      },
    },
    {
      name: "customer",
      type: "group",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "phone", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "address", type: "textarea" },
        { name: "notes", type: "textarea" },
      ],
      access: {
        update: () => false,
      },
    },
    {
      name: "bookingDate",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMM yyyy",
        },
      },
      access: {
        update: () => false,
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "startTime",
          type: "text",
          required: true,
          label: "Start (HH:mm)",
        },
        { name: "endTime", type: "text", required: true, label: "End (HH:mm)" },
      ],
      access: {
        update: () => false,
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Completed", value: "completed" },
      ],
      access: {
        update: () => false,
      },
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      min: 0,
      access: {
        update: () => false,
      },
    },
  ],
};
