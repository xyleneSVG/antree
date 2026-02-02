"use client";

import React, { useState, useRef } from "react";
import {
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Receipt,
  Mail,
  Phone,
  Copy,
  Check,
  X,
  Download,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  Service,
  Resource,
  TimeSlot,
  Tenant,
  Customer,
} from "@/types/booking";
import {
  formatPrice,
  formatDuration,
  getDayName,
} from "@/utilities/booking-utils";
import { toPng } from "html-to-image";

interface BookingSuccessProps {
  tenant: Tenant;
  service: Service;
  resource: Resource;
  date: Date;
  timeSlot: TimeSlot;
  customer: Customer;
  bookingCode: string;
  onNewBooking: () => void;
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

export function BookingSuccess({
  tenant,
  service,
  resource,
  date,
  timeSlot,
  customer,
  bookingCode,
  onNewBooking,
}: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const copyBookingCode = () => {
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "transparent",
        fontEmbedCSS: "",
      });

      const link = document.createElement("a");
      link.download = `E-Ticket-${bookingCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal download tiket:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-success to-success/80 shadow-lg shadow-success/30">
            <CheckCircle2 className="h-12 w-12 text-success-foreground" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            Reservasi Berhasil!
          </h2>
          <p className="text-muted-foreground">
            Terima kasih,{" "}
            <span className="font-medium text-foreground">{customer.name}</span>
            . Reservasi Anda telah berhasil dibuat.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Kode Reservasi</p>
              <p className="font-mono text-lg font-bold text-primary tracking-wide">
                {bookingCode}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyBookingCode}
              className="gap-2 bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Salin
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-semibold text-foreground">
            Detail Reservasi
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal & Waktu</p>
                <p className="font-semibold text-foreground">
                  {getDayName(date.getDay())}, {date.getDate()}{" "}
                  {MONTHS[date.getMonth()]} {date.getFullYear()}
                </p>
                <p className="text-primary">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staf</p>
                <p className="font-semibold text-foreground">{resource.name}</p>
                {resource.specialty && (
                  <p className="text-sm text-muted-foreground">
                    {resource.specialty}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Layanan</p>
                <p className="font-semibold text-foreground">{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(service.durationMinutes)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-semibold text-foreground">{tenant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {tenant.address}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Biaya</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-secondary/50 p-5">
          <p className="mb-3 text-sm font-medium text-foreground">
            Konfirmasi telah dikirim ke:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Harap datang 10 menit sebelum jadwal. Jika ada pertanyaan, hubungi
            kami di{" "}
            <span className="font-medium text-foreground">{tenant.phone}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onNewBooking}
            className="flex-1 bg-transparent"
          >
            Buat Baru
          </Button>
          <Button className="flex-1 gap-2" onClick={() => setShowTicket(true)}>
            <Receipt className="h-4 w-4" />
            Lihat E-Ticket
          </Button>
        </div>
      </div>

      {showTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowTicket(false)}
              className="absolute -right-2 -top-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:-right-10 sm:top-0"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              ref={ticketRef}
              className="overflow-hidden rounded-3xl bg-card text-card-foreground shadow-2xl"
              style={{
                fontFamily:
                  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              <div className="bg-primary p-6 text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-80">
                      E-TICKET RESERVASI
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{tenant.name}</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <span className="text-lg font-bold">
                      {tenant.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative bg-card px-6 py-8">
                <div className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[#09090b]"></div>
                <div className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[#09090b]"></div>

                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Kode Booking
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-wider text-primary">
                      {bookingCode}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 rounded-xl bg-secondary/30 p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Tanggal</p>
                      <p className="font-semibold">
                        {date.getDate()} {MONTHS[date.getMonth()]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {date.getFullYear()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Jam</p>
                      <p className="font-semibold text-primary">
                        {timeSlot.startTime}
                      </p>
                      <p className="text-xs text-muted-foreground">WIB</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-dashed border-border pb-3">
                      <span className="text-sm text-muted-foreground">
                        Layanan
                      </span>
                      <span className="text-sm font-medium">
                        {service.name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-border pb-3">
                      <span className="text-sm text-muted-foreground">
                        Staf
                      </span>
                      <span className="text-sm font-medium">
                        {resource.name}
                      </span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-sm text-muted-foreground">
                        Pelanggan
                      </span>
                      <span className="text-sm font-medium">
                        {customer.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-border bg-secondary/30 p-6">
                <div className="flex flex-col items-center justify-center gap-3">
                  <QrCode className="h-16 w-16 text-foreground/80" />
                  <p className="text-center text-xs text-muted-foreground">
                    Tunjukkan tiket ini kepada resepsionis
                    <br />
                    saat kedatangan
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleDownloadTicket}
                className="flex-1 gap-2 shadow-lg shadow-primary/20"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  "Memproses..."
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Tiket
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
