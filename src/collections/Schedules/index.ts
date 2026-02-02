import type { CollectionConfig } from "payload";
import {
  validateUniqueDays,
  validateEndTime,
  validateTimeFormat,
} from "./validations";
import { schedulesReadAccess } from "./access/read";
import { schedulesUpdateAccess } from "./access/updateDelete";


export const Schedules: CollectionConfig = {
  slug: "schedules",
  admin: {
    useAsTitle: "resource",
    defaultColumns: ["resource", "updatedAt"],
    group: "Platform Settings",
  },
  access: {
    read: schedulesReadAccess,
    update: schedulesUpdateAccess,
    delete: schedulesUpdateAccess,
  },
  fields: [
    {
      name: "resource",
      type: "relationship",
      relationTo: "users",
      required: true,
      unique: true,
    },
    {
      name: "weeklySchedule",
      type: "array",
      label: "Jadwal Mingguan",
      minRows: 1,
      validate: validateUniqueDays,
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "dayOfWeek",
              type: "select",
              label: "Hari",
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
              admin: {
                width: "40%",
              },
            },
            {
              name: "startTime",
              type: "text",
              label: "Mulai",
              required: true,
              admin: { placeholder: "08:00", width: "30%" },
              validate: validateTimeFormat,
            },
            {
              name: "endTime",
              type: "text",
              label: "Selesai",
              required: true,
              admin: { placeholder: "17:00", width: "30%" },
              validate: validateEndTime,
            },
          ],
        },
      ],
    },
  ],
};
