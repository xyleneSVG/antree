"use client";

import React, { useState } from "react";
import { User, Phone, Mail, MapPin, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Service,
  Resource,
  TimeSlot,
  Customer,
} from "@/types/booking";
import { formatPrice, formatDuration, getDayName } from "@/utilities/booking-utils";
import { cn } from "@/utilities/utils";

interface BookingFormProps {
  service: Service;
  resource: Resource;
  date: Date;
  timeSlot: TimeSlot;
  onSubmit: (data: Customer) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function BookingForm({
  service,
  resource,
  date,
  timeSlot,
  onSubmit,
  onBack,
  isSubmitting = false,
}: BookingFormProps) {
  const [formData, setFormData] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>(
    {},
  );

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Customer, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama minimal 3 karakter";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (
      !/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address?.trim(),
        notes: formData.notes?.trim(),
      });
    }
  };

  const updateField = (field: keyof Customer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <div className="sticky top-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-foreground">
              Ringkasan Reservasi
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Layanan</p>
                  <p className="font-semibold text-foreground">
                    {service.name}
                  </p>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(service.price)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">Durasi</p>
                  <p className="font-medium text-foreground">
                    {formatDuration(service.durationMinutes)}
                  </p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">Staf</p>
                  <p className="font-medium text-foreground">{resource.name}</p>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">Jadwal</p>
                <p className="font-medium text-foreground">
                  {getDayName(date.getDay())}, {date.getDate()}{" "}
                  {MONTHS[date.getMonth()]} {date.getFullYear()}
                </p>
                <p className="text-primary">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="order-1 space-y-6 lg:order-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-semibold text-foreground">
            Data Pelanggan
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={cn("pl-10", errors.name && "border-destructive")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Nomor Telepon <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={cn(
                      "pl-10",
                      errors.phone && "border-destructive",
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={cn(
                      "pl-10",
                      errors.email && "border-destructive",
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">
                Alamat{" "}
                <span className="text-muted-foreground text-sm">
                  (Opsional)
                </span>
              </Label>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat lengkap"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="min-h-20 resize-none pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">
                Catatan{" "}
                <span className="text-muted-foreground text-sm">
                  (Opsional)
                </span>
              </Label>
              <div className="relative">
                <FileText className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="notes"
                  placeholder="Catatan khusus untuk reservasi ini"
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-20 resize-none pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 bg-transparent"
          >
            Kembali
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Konfirmasi Reservasi"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
