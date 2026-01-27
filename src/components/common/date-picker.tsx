"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/utilities/utils";
import { Button } from "@/components/ui/button";
import { getDayName } from "@/utilities/booking-utils";

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  resourceId: string | null;
  availableWeekdays: number[];
}

const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
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

export function DatePicker({
  selectedDate,
  onSelectDate,
  resourceId,
  availableWeekdays = [],
}: DatePickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
      return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const canGoPrev = () => {
    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return prevDate >= todayMonth;
  };

  const isDateSelectable = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (date < todayStart) return false;

    if (availableWeekdays.length > 0) {
      const dayIndex = date.getDay();
      if (!availableWeekdays.includes(dayIndex)) {
        return false;
      }
    }

    return true;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const handleSelectDate = (day: number) => {
    if (!isDateSelectable(day)) return;
    const newDate = new Date(currentYear, currentMonth, day);
    newDate.setHours(12, 0, 0, 0);
    onSelectDate(newDate);
  };

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-11" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const selectable = isDateSelectable(day);
    const selected = isSelected(day);
    const todayDate = isToday(day);

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleSelectDate(day)}
        disabled={!selectable}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
          selectable && !selected && "hover:bg-primary/10 hover:text-primary",
          selected &&
            "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
          !selectable && "cursor-not-allowed text-muted-foreground/30",
          todayDate && !selected && "bg-accent/10 text-accent font-bold",
        )}
      >
        {day}
      </button>,
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            disabled={!canGoPrev()}
            className="h-9 w-9 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-9 w-9 rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS_SHORT.map((day, index) => (
          <div
            key={day}
            className={cn(
              "flex h-10 items-center justify-center text-xs font-semibold",
              index === 0 || index === 6
                ? "text-destructive/70"
                : "text-muted-foreground",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>

      {selectedDate && (
        <div className="mt-5 rounded-xl bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">Tanggal dipilih</p>
          <p className="mt-0.5 text-lg font-semibold text-primary">
            {getDayName(selectedDate.getDay())}, {selectedDate.getDate()}{" "}
            {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </p>
        </div>
      )}
    </div>
  );
}
