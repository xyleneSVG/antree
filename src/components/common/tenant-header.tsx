"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";
import type { Tenant } from "@/types/booking";
import { getDayName } from "@/utilities/booking-utils";
import { cn } from "@/utilities/utils";
import { Media } from "@/payload-types";
import { formatMediaUrl } from "@/utilities/media-url-format";
import Image from "next/image";

interface TenantHeaderProps {
  tenant: Tenant;
}

export function TenantHeader({ tenant }: TenantHeaderProps) {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const today = new Date().getDay();
  const todayHours = tenant.operatingHours?.find((h) => h.dayOfWeek === today);
  const logoUrl = formatMediaUrl(tenant.logo as Media);

  const sortedHours = [...(tenant.operatingHours || [])].sort((a, b) => {
    const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return dayA - dayB;
  });

  return (
    <header className="relative border-b border-border bg-card z-20">
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-accent/5" />

      <div className="relative mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Image
              src={logoUrl}
              alt={tenant.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {tenant.name}
              </h1>
              {todayHours && !todayHours.isClosed && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Buka Hari Ini
                </span>
              )}
            </div>

            <p className="mt-2 text-balance text-muted-foreground">
              {tenant.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>{tenant.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Phone className="h-4 w-4" />
                </div>
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Mail className="h-4 w-4" />
                </div>
                <span>{tenant.email}</span>
              </div>

              {todayHours && (
                <div className="relative">
                  <button
                    onClick={() => setIsHoursOpen(!isHoursOpen)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground",
                      isHoursOpen &&
                        "bg-secondary text-foreground ring-2 ring-primary/20",
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    <span>
                      {todayHours.isClosed
                        ? "Tutup Hari Ini"
                        : `${getDayName(today)}: ${todayHours.open} - ${todayHours.close}`}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isHoursOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isHoursOpen && (
                    <div className="absolute left-1/2 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-200 sm:left-0 sm:translate-x-0 z-50">
                      <div className="space-y-1">
                        <div className="mb-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
                          Jam Operasional
                        </div>
                        {sortedHours.map((schedule) => {
                          const isToday = schedule.dayOfWeek === today;
                          return (
                            <div
                              key={schedule.dayOfWeek}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                                isToday
                                  ? "bg-primary/10 font-medium text-primary"
                                  : "text-muted-foreground hover:bg-muted",
                              )}
                            >
                              <span>{getDayName(schedule.dayOfWeek)}</span>
                              <span>
                                {schedule.isClosed
                                  ? "Tutup"
                                  : `${schedule.open} - ${schedule.close}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
