"use client"

import { Check, User } from "lucide-react"
import { cn } from "@/utilities/utils"
import type { Resource } from "@/types/booking"

interface ResourceCardProps {
  resource: Resource
  selected: boolean
  onSelect: (resource: Resource) => void
}

export function ResourceCard({ resource, selected, onSelect }: ResourceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(resource)}
      className={cn(
        "group relative flex w-full flex-col items-center gap-4 rounded-2xl border-2 p-6 text-center transition-all duration-300",
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
      <div className={cn(
        "flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300",
        selected
          ? "bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20"
          : "bg-linear-to-br from-secondary to-muted group-hover:from-primary/20 group-hover:to-primary/10"
      )}>
        <User className={cn(
          "h-10 w-10 transition-colors",
          selected ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
        )} />
      </div>
      
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground">{resource.name}</h3>
        {resource.specialty && (
          <p className={cn(
            "mt-1 text-sm transition-colors",
            selected ? "text-primary" : "text-muted-foreground"
          )}>
            {resource.specialty}
          </p>
        )}
      </div>
    </button>
  )
}
