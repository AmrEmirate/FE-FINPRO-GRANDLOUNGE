// src/components/tenant/availability-calendar.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isWithinInterval } from "date-fns"; // <-- FIX 1: Impor 'format'
import { DayPicker, type DateRange, type DayProps } from "react-day-picker";
import { Ban } from "lucide-react";
import "react-day-picker/dist/style.css";

import { AvailabilityDialog } from "./AvailabilityDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PeakSeason } from "./PeakSeasonDialog";

// Tipe data (tetap sama)
interface Availability {
  date: string;
  isAvailable: boolean;
  price?: number;
}
interface AvailabilityCalendarProps {
  basePrice: number;
  availabilityData: Availability[];
  peakSeasons: PeakSeason[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  onSave: (dates: DateRange, isAvailable: boolean, price?: number) => void;
}

export function AvailabilityCalendar({
  basePrice,
  availabilityData,
  peakSeasons,
  currentMonth,
  onMonthChange,
  onSave,
}: AvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Data awal untuk dialog
  const [dialogInitialState, setDialogInitialState] = useState({ available: true, price: 0 });

  const availabilityMap = useMemo(() => new Map(
    availabilityData.map(a => [a.date.split("T")[0], a])
  ), [availabilityData]);

  // Buka dialog saat rentang tanggal selesai dipilih
  useEffect(() => {
    if (selectedRange?.from && selectedRange.to) {
      const fromKey = format(selectedRange.from, "yyyy-MM-dd");
      const fromData = availabilityMap.get(fromKey);
      setDialogInitialState({
        available: fromData?.isAvailable ?? true,
        price: fromData?.price ?? 0,
      });
      setIsDialogOpen(true);
    }
  }, [selectedRange, availabilityMap]);

  // <-- FIX 2: Fungsi ini sekarang cocok dengan props 'onSave' dari dialog
  const handleSaveSettings = (isAvailable: boolean, price?: number | null) => {
    if (selectedRange?.from && selectedRange.to) {
      onSave(selectedRange, isAvailable, price || undefined);
      setIsDialogOpen(false);
      setSelectedRange(undefined);
    }
  };

  // Logika kalkulasi harga (tetap sama)
  const calculateFinalPrice = (date: Date): number | null => {
    const key = format(date, "yyyy-MM-dd");
    const a = availabilityMap.get(key);
    if (a && !a.isAvailable) return null;

    let currentPrice = basePrice;
    const season = peakSeasons.find(s => isWithinInterval(date, { start: s.startDate, end: s.endDate }));
    if (season) {
        currentPrice = season.adjustmentType === 'NOMINAL' 
            ? basePrice + season.adjustmentValue 
            : basePrice * (1 + season.adjustmentValue / 100);
    }

    return a?.price && a.price > 0 ? a.price : currentPrice;
  }

  // Komponen untuk setiap hari di kalender (tetap sama)
  function CustomDay(props: DayProps) {
    const date = (props as any).day?.date ?? (props as any).date;
    const finalPrice = calculateFinalPrice(date);
    const isUnavailable = finalPrice === null || props.modifiers?.disabled;

    return (
      <td {...(props as any)}>
        <div className={cn("relative flex h-14 w-14 flex-col items-center justify-center rounded-md p-0", isUnavailable && "bg-slate-50 text-muted-foreground opacity-70")}>
          <span>{format(date, "d")}</span>
          <div className="mt-1 text-[10px]">
            {isUnavailable ? (
              <span className="flex items-center font-semibold text-red-600"><Ban className="mr-1 h-3 w-3" />N/A</span>
            ) : (
              <Badge variant="secondary">{finalPrice?.toLocaleString("id-ID")}</Badge>
            )}
          </div>
        </div>
      </td>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={setSelectedRange}
          month={currentMonth}
          onMonthChange={onMonthChange}
          components={{ Day: CustomDay as any }}
          className="rounded-md border p-4"
        />
      </div>

      <AvailabilityDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRange(undefined);
        }}
        onSave={handleSaveSettings}
        selectedRange={selectedRange}
        initialAvailable={dialogInitialState.available}
        initialPrice={dialogInitialState.price}
      />
    </>
  );
}