"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

function generateTenantAcronym(name: string): string {
  if (!name) return "BKG";
  const matches = name.match(/\b(\w)/g);
  return matches
    ? matches.join("").toUpperCase()
    : name.substring(0, 3).toUpperCase();
}

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createBooking(data: {
  tenantId: string;
  serviceId: string;
  resourceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  price: number;
  customer: any;
}) {
  const headersList = await headers();
  const payload = await getPayload({ config: configPromise });

  const req = { headers: headersList };

  try {
    const tenant = await payload.findByID({
      collection: "tenants",
      id: data.tenantId,
      overrideAccess: false,
      req,
    });

    if (!tenant) throw new Error("Tenant not found or access denied");

    let bookingCode = "";
    let isUnique = false;
    const acronym = generateTenantAcronym(tenant.name);

    while (!isUnique) {
      bookingCode = `${acronym}-${generateRandomString(5)}`;

      const existing = await payload.find({
        collection: "bookings",
        where: { bookingCode: { equals: bookingCode } },
        limit: 1,
      });

      if (existing.totalDocs === 0) isUnique = true;
    }

    const booking = await payload.create({
      collection: "bookings",
      data: {
        bookingCode,
        service: Number(data.serviceId),
        resource: Number(data.resourceId),
        bookingDate: data.date.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        totalAmount: data.price,
        status: "pending",
        customer: data.customer,
        tenant: Number(data.tenantId),
      },

      overrideAccess: true,
      req,
    });

    revalidatePath("/admin/collections/bookings");

    return { success: true, bookingId: booking.id, bookingCode };
  } catch (error) {
    console.error("Booking Creation Error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}
