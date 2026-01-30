import { Media } from "@/payload-types";

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  logo: Media | string;
  accentColor: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: {
    dayOfWeek: number;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
}

export interface Resource {
  id: string;
  tenantId: string;
  name: string;
  avatar: string;
  specialty?: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  category?: string;
}

export interface Schedule {
  id: string;
  resourceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  tenantId: string;
  resourceId: string;
  serviceId: string;
  customer: Customer;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalAmount: number;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}