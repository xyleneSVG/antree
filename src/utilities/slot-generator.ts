import type { Schedule, Booking, TimeSlot } from "@/types/booking"

const SLOT_INTERVAL_MINUTES = 15

/**
 * Parse time string "HH:MM" to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Convert minutes since midnight to time string "HH:MM"
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

/**
 * Check if two time ranges overlap
 */
function hasOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return start1 < end2 && end1 > start2
}

/**
 * Generate available time slots for a given resource, date, and service duration
 */
export function generateTimeSlots(
  resourceId: string,
  date: Date,
  durationMinutes: number,
  schedules: Schedule[],
  existingBookings: Booking[]
): TimeSlot[] {
  const dayOfWeek = date.getDay()
  const dateString = date.toISOString().split("T")[0]

  // Get schedules for this resource on this day
  const resourceSchedules = schedules.filter(
    (s) => s.resourceId === resourceId && s.dayOfWeek === dayOfWeek
  )

  if (resourceSchedules.length === 0) {
    return []
  }

  // Get existing bookings for this resource on this date
  const dayBookings = existingBookings.filter(
    (b) =>
      b.resourceId === resourceId &&
      b.bookingDate === dateString &&
      b.status !== "cancelled"
  )

  const slots: TimeSlot[] = []

  // For each schedule block, generate slots
  for (const schedule of resourceSchedules) {
    const scheduleStart = timeToMinutes(schedule.startTime)
    const scheduleEnd = timeToMinutes(schedule.endTime)

    // Generate slots with interval
    for (
      let slotStart = scheduleStart;
      slotStart + durationMinutes <= scheduleEnd;
      slotStart += SLOT_INTERVAL_MINUTES
    ) {
      const slotEnd = slotStart + durationMinutes

      // Check if this slot conflicts with any existing booking
      const hasConflict = dayBookings.some((booking) => {
        const bookingStart = timeToMinutes(booking.startTime)
        const bookingEnd = timeToMinutes(booking.endTime)
        return hasOverlap(slotStart, slotEnd, bookingStart, bookingEnd)
      })

      slots.push({
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
        available: !hasConflict,
        id: ""
      })
    }
  }

  // Sort slots by start time and remove duplicates
  const uniqueSlots = slots.reduce((acc, slot) => {
    const existing = acc.find((s) => s.startTime === slot.startTime)
    if (!existing) {
      acc.push(slot)
    }
    return acc
  }, [] as TimeSlot[])

  return uniqueSlots.sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate < today
}

/**
 * Check if resource is available on a specific day of week
 */
export function isResourceAvailableOnDay(
  resourceId: string,
  dayOfWeek: number,
  schedules: Schedule[]
): boolean {
  return schedules.some(
    (s) => s.resourceId === resourceId && s.dayOfWeek === dayOfWeek
  )
}
