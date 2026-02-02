import type { Validate } from "payload";

const parseTime = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const validateUniqueDays: Validate = (value) => {
  if (!Array.isArray(value)) return true;

  const days = value.map((row) => row.dayOfWeek).filter(Boolean);
  const uniqueDays = new Set(days);

  if (days.length !== uniqueDays.size) {
    return "Hari tidak boleh sama (duplikat). Silakan edit baris yang sudah ada.";
  }

  return true;
};

export const validateEndTime: Validate = (value, { siblingData }) => {
  if (!value || !siblingData?.startTime) return true;

  const start = parseTime(siblingData.startTime);
  const end = parseTime(value as string);

  if (end <= start) {
    return "Waktu selesai harus lebih besar dari waktu mulai";
  }

  return true;
};

export const validateTimeFormat: Validate = (val: unknown) => {
  if (!val) return true;
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!regex.test(val as string)) return "Format harus HH:mm";
  return true;
};