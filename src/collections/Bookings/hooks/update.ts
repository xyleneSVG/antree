"use server"

import { getPayload } from "payload"
import configPromise from "@payload-config"

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed") {
  const payload = await getPayload({ config: configPromise })
  try {
    await payload.update({
      collection: "bookings",
      id,
      data: { status },
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function deleteBooking(id: string) {
  const payload = await getPayload({ config: configPromise })
  try {
    await payload.delete({
      collection: "bookings",
      id,
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}