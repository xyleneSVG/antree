"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utilities/utils";
import type { TimeSlot } from "@/types/booking";

interface TimeSlotPickerProps {
  availableSlots: TimeSlot[];
  bookedSlots?: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
  availableSlots,
  bookedSlots = [],
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  const hasSlots = availableSlots.length > 0 || bookedSlots.length > 0;

  if (!hasSlots) {
    return (
      <div className="flex h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
        <div className="rounded-full bg-secondary p-3 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="font-medium text-foreground">Tidak ada jadwal tersedia</p>
        <p className="text-sm text-muted-foreground mt-1">
          Silakan pilih tanggal lain
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      {availableSlots.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200" />
            <span className="text-sm font-medium text-foreground">
              Tersedia ({availableSlots.length} slot)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {availableSlots.map((slot, index) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;

              return (
                <Button
                  key={`avail-${index}`}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-12 w-full transition-all duration-200",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 bg-primary text-primary-foreground font-semibold shadow-md"
                      : "bg-background hover:border-primary hover:text-primary hover:bg-primary/5",
                  )}
                  onClick={() => onSelectSlot(slot)}
                >
                  {slot.startTime}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {availableSlots.length > 0 && bookedSlots.length > 0 && (
        <div className="h-px bg-border/60" />
      )}

      {bookedSlots.length > 0 && (
        <div className="space-y-3 opacity-70">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="text-sm font-medium text-muted-foreground">
              Sudah Terisi
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {bookedSlots.map((slot, index) => (
              <Button
                key={`booked-${index}`}
                variant="ghost"
                disabled
                className="h-12 w-full border border-transparent bg-secondary/50 text-muted-foreground/50 cursor-not-allowed font-normal box-decoration-slice"
              >
                <span className="line-through decoration-muted-foreground/30">
                  {slot.startTime}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
