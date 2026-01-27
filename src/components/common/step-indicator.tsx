"use client"

import React from "react"
import { Check, Briefcase, Users, CalendarDays, ClipboardCheck } from "lucide-react"
import { cn } from "@/utilities/utils"

export type BookingStep = "service" | "resource" | "datetime" | "confirm"

interface StepIndicatorProps {
  currentStep: BookingStep
}

const STEPS: { key: BookingStep; label: string; icon: React.ElementType }[] = [
  { key: "service", label: "Layanan", icon: Briefcase },
  { key: "resource", label: "Staf", icon: Users },
  { key: "datetime", label: "Jadwal", icon: CalendarDays },
  { key: "confirm", label: "Konfirmasi", icon: ClipboardCheck },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm w-full">
      {/* Tambahkan w-full di sini agar container memanjang penuh */}
      <div className="flex w-full items-start">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isLastStep = index === STEPS.length - 1
          const StepIcon = step.icon

          return (
            <div
              key={step.key}
              className={cn(
                "flex items-center",
                // PERBAIKAN UTAMA:
                // Jika item terakhir, gunakan 'flex-none' agar tidak memakan ruang kosong di kanan.
                // Jika bukan item terakhir, gunakan 'flex-1' agar garisnya memanjang mendorong item berikutnya.
                isLastStep ? "flex-none" : "flex-1"
              )}
            >
              {/* Group Icon & Label */}
              <div className="flex flex-col items-center z-10 relative">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                    isCompleted && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                    isCurrent && "bg-primary/10 text-primary ring-2 ring-primary ring-offset-2 ring-offset-card",
                    !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                {/* Label dengan absolute positioning trick atau min-width agar center alignment rapi */}
                <div className="mt-2 flex justify-center">
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors whitespace-nowrap",
                      isCurrent && "text-primary",
                      isCompleted && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Garis Penghubung (Connector) */}
              {!isLastStep && (
                <div className="flex-1 flex items-center h-12 px-2 -ml-2 -mr-2 z-0">
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500",
                        index < currentIndex ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}