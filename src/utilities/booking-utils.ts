import { Schedule, Booking, TimeSlot } from "@/types/booking";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} jam`;
  return `${hours} jam ${remainingMinutes} menit`;
}

export function getDayName(dayOfWeek: number): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[dayOfWeek];
}

export function getShortDayName(dayOfWeek: number): string {
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return days[dayOfWeek];
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

/**
 * Menghitung slot waktu yang tersedia berdasarkan jadwal resource dan booking yang sudah ada.
 * * @param date Tanggal yang dipilih
 * @param resourceId ID resource (dokter/staf)
 * @param durationMinutes Durasi layanan
 * @param schedules Data jadwal kerja (dari Payload)
 * @param existingBookings Data booking yang sudah ada (dari Payload)
 */
export function getAvailableTimeSlots(
  date: Date,
  resourceId: string,
  durationMinutes: number,
  schedules: Schedule[],
  existingBookings: Booking[],
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const dateString = date.toISOString().split("T")[0];

  const activeSchedules = schedules.filter(
    (s) => s.resourceId === resourceId && s.dayOfWeek === dayOfWeek,
  );

  if (activeSchedules.length === 0) return [];

  const currentDayBookings = existingBookings.filter(
    (b) =>
      b.resourceId === resourceId &&
      b.bookingDate === dateString &&
      b.status !== "cancelled",
  );

  const slots: TimeSlot[] = [];

  activeSchedules.forEach((schedule) => {
    let current = parseTime(schedule.startTime);
    const end = parseTime(schedule.endTime);

    while (current + durationMinutes <= end) {
      const startSlot = formatTimeMinutes(current);
      const endSlot = formatTimeMinutes(current + durationMinutes);

      const isBooked = currentDayBookings.some((booking) => {
        const bookingStart = parseTime(booking.startTime);
        const bookingEnd = parseTime(booking.endTime);

        return current < bookingEnd && current + durationMinutes > bookingStart;
      });

      slots.push({
        id: `${dateString}-${startSlot}`,
        startTime: startSlot,
        endTime: endSlot,
        available: !isBooked,
      });

      current += 30;
    }
  });

  return slots;
}
