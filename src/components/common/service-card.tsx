"use client"

import { Clock, Check, Tag } from "lucide-react"
import { cn } from "@/utilities/utils"
import type { Service } from "@/types/booking"
import { formatPrice, formatDuration } from "@/utilities/booking-utils"

interface ServiceCardProps {
  service: Service
  selected: boolean
  onSelect: (service: Service) => void
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className={cn(
        "group relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-300",
        "hover:shadow-md",
        selected
          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
          : "border-border bg-card hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
          selected
            ? "border-primary bg-primary scale-100"
            : "border-muted-foreground/30 bg-transparent scale-90 group-hover:border-primary/50"
        )}
      >
        {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
      </div>

      {service.category && (
        <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          <Tag className="h-3 w-3" />
          {service.category}
        </span>
      )}
      
      <h3 className="pr-8 text-lg font-semibold text-foreground">{service.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {service.description}
      </p>
      
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDuration(service.durationMinutes)}</span>
        </div>
        <span className={cn(
          "text-lg font-bold transition-colors",
          selected ? "text-primary" : "text-foreground"
        )}>
          {formatPrice(service.price)}
        </span>
      </div>
    </button>
  )
}
