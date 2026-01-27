"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { headers } from "next/headers";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTimeMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

const getPayloadClient = async () => {
  const headersList = await headers();
  const payload = await getPayload({ config: configPromise });

  return { payload, req: { headers: headersList } };
};

export const getResourceWorkDays = async (
  resourceId: string,
): Promise<number[]> => {
  const { payload, req } = await getPayloadClient();

  const schedules = await payload.find({
    collection: "schedules",
    where: {
      resource: { equals: resourceId },
    },
    limit: 1,

    overrideAccess: true,
    req,
  });

  if (!schedules.docs.length || !schedules.docs[0].weeklySchedule) {
    return [];
  }

  return schedules.docs[0].weeklySchedule
    .map((s) => parseInt(s.dayOfWeek as string))
    .filter((d) => !isNaN(d));
};

export const getAvailableTimeSlots = async (
  date: Date,
  resourceId: string,
  serviceDurationMinutes: number,
): Promise<{ available: TimeSlot[]; booked: TimeSlot[] }> => {
  const { payload, req } = await getPayloadClient();

  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay().toString();

  const schedulesReq = await payload.find({
    collection: "schedules",
    where: {
      resource: { equals: resourceId },
    },
    limit: 1,
    overrideAccess: true,
    req,
  });

  if (schedulesReq.docs.length === 0 || !schedulesReq.docs[0].weeklySchedule) {
    return { available: [], booked: [] };
  }

  const scheduleDoc = schedulesReq.docs[0];
  const activeDaySchedule = scheduleDoc.weeklySchedule?.find(
    (day) => day.dayOfWeek === dayOfWeek,
  );

  if (
    !activeDaySchedule ||
    !activeDaySchedule.startTime ||
    !activeDaySchedule.endTime
  ) {
    return { available: [], booked: [] };
  }

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const bookingsReq = await payload.find({
    collection: "bookings",
    where: {
      resource: { equals: resourceId },
      bookingDate: {
        greater_than_equal: startOfDay.toISOString(),
        less_than_equal: endOfDay.toISOString(),
      },
      status: {
        not_in: ["cancelled", "rejected"],
      },
    },
    req,
  });

  const existingBookings = bookingsReq.docs;
  const available: TimeSlot[] = [];
  const booked: TimeSlot[] = [];
  const dateString = targetDate.toISOString().split("T")[0];

  let currentMinutes = parseTime(activeDaySchedule.startTime);
  const endMinutes = parseTime(activeDaySchedule.endTime);

  while (currentMinutes + serviceDurationMinutes <= endMinutes) {
    const slotStart = currentMinutes;
    const slotEnd = currentMinutes + serviceDurationMinutes;

    const startString = formatTimeMinutes(slotStart);
    const endString = formatTimeMinutes(slotEnd);

    const isBooked = existingBookings.some((booking) => {
      if (
        typeof booking.startTime !== "string" ||
        typeof booking.endTime !== "string"
      )
        return false;

      const bookingStart = parseTime(booking.startTime);
      const bookingEnd = parseTime(booking.endTime);

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });

    const slot: TimeSlot = {
      id: `${dateString}-${startString}`,
      startTime: startString,
      endTime: endString,
      available: !isBooked,
    };

    if (isBooked) {
      booked.push(slot);
    } else {
      available.push(slot);
    }

    currentMinutes += serviceDurationMinutes;
  }

  return { available, booked };
};

export const getTenantByDomain = async (domain: string) => {
  const { payload, req } = await getPayloadClient();

  const result = await payload.find({
    collection: "tenants",
    where: { domain: { equals: domain } },
    limit: 1,
    overrideAccess: true,
    req,
  });
  return result.docs[0] || null;
};

export const getServices = async (tenantId: string) => {
  const { payload, req } = await getPayloadClient();

  const result = await payload.find({
    collection: "services",
    where: {
      tenant: { equals: tenantId },
      isActive: { equals: true },
    },
    overrideAccess: true,
    req,
  });
  return result.docs;
};

export const getResources = async (tenantId: string) => {
  const { payload, req } = await getPayloadClient();

  const result = await payload.find({
    collection: "users",
    where: {
      tenant: { equals: tenantId },
      isActive: { equals: true },
    },
    overrideAccess: true,
    req,
  });
  return result.docs;
};
