"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, isWithinInterval } from "date-fns"
import { DayPicker, type DateRange, type DayProps } from "react-day-picker"
import { Ban } from "lucide-react"
import "react-day-picker/dist/style.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PeakSeason } from "./PeakSeasonDialog"

interface Availability {
  date: string
  isAvailable: boolean
  price?: number
}

interface AvailabilityCalendarProps {
  basePrice: number
  availabilityData: Availability[]
  peakSeasons: PeakSeason[]
  currentMonth: Date
  onMonthChange: (month: Date) => void
  onSave: (dates: DateRange, isAvailable: boolean, price?: number) => void
}

export function AvailabilityCalendar({
  basePrice,
  availabilityData,
  peakSeasons,
  currentMonth,
  onMonthChange,
  onSave,
}: AvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [price, setPrice] = useState<number>(0)

  const availabilityMap = new Map(availabilityData.map(a => {
    const dateKey = a.date.split('T')[0];
    return [dateKey, a];
  }));

  useEffect(() => {
    if (selectedRange?.from && !selectedRange.to) {
      const fromDateString = format(selectedRange.from, "yyyy-MM-dd");
      const fromData = availabilityMap.get(fromDateString);
      setPrice(fromData?.price ?? basePrice);
    } else if (selectedRange?.from && selectedRange.to) {
      setIsDialogOpen(true);
    }
  }, [selectedRange, basePrice, availabilityMap]);

  const handleSaveSettings = () => {
    if (selectedRange?.from && selectedRange.to) {
      const range = {
          from: selectedRange.from < selectedRange.to ? selectedRange.from : selectedRange.to,
          to: selectedRange.from < selectedRange.to ? selectedRange.to : selectedRange.from
      }
      onSave(range, true, price || basePrice) 
      setIsDialogOpen(false)
      setSelectedRange(undefined)
    }
  }
  
  const calculateFinalPrice = (date: Date): number | null => {
    const dateString = format(date, "yyyy-MM-dd");
    const availability = availabilityMap.get(dateString);

    if (availability && !availability.isAvailable) {
      return null;
    }

    let currentPrice = availability?.price ?? basePrice;

    for (const season of peakSeasons) {
      if (isWithinInterval(date, { start: season.startDate, end: season.endDate })) {
        if (season.adjustmentType === 'NOMINAL') {
          currentPrice += season.adjustmentValue;
        } else if (season.adjustmentType === 'PERCENTAGE') {
          currentPrice *= (1 + season.adjustmentValue / 100);
        }
        break; 
      }
    }
    return currentPrice;
  };

  function CustomDay(props: DayProps) {
    const dateString = format(props.day.date, "yyyy-MM-dd");
    const data = availabilityMap.get(dateString);
    
    const finalPrice = calculateFinalPrice(props.day.date);
    const isUnavailable = (data && !data.isAvailable) || props.modifiers.disabled;

    return (
      <div
        className={cn(
          "relative flex h-16 w-16 flex-col items-center justify-center rounded-md p-0",
          isUnavailable && "cursor-not-allowed text-muted-foreground opacity-70 bg-slate-50"
        )}
      >
        <span>{format(props.day.date, "d")}</span>
        <div className="mt-1 text-[10px]">
          {isUnavailable ? (
            <span className="flex items-center font-semibold text-red-600">
              <Ban className="mr-1 h-3 w-3" />
              Unavailable
            </span>
          ) : (
            <Badge
              variant={data?.price || (finalPrice && finalPrice !== basePrice) ? "destructive" : "secondary"}
              className="h-auto leading-tight px-1"
            >
              {finalPrice ? Math.round(finalPrice).toLocaleString("id-ID") : basePrice.toLocaleString("id-ID")}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          required={false} // <-- PERBAIKAN DITAMBAHKAN DI SINI
          selected={selectedRange}
          onSelect={setSelectedRange}
          month={currentMonth}
          onMonthChange={(month) => onMonthChange(startOfMonth(month))}
          numberOfMonths={1}
          components={{ Day: CustomDay }}
          className="rounded-md border bg-white p-4"
        />
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">Drag untuk memilih rentang tanggal dan mengatur harga spesial.</p>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) setSelectedRange(undefined); 
          setIsDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Harga</DialogTitle>
            <DialogDescription>
                Atur harga spesial untuk rentang tanggal yang dipilih. Untuk mengubah ketersediaan, gunakan tombol "Atur Ketersediaan".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="text-center text-sm font-semibold">
                {selectedRange?.from && format(selectedRange.from, 'PPP')}
                {selectedRange?.to && ` - ${format(selectedRange.to, 'PPP')}`}
            </div>
            <div>
              <Label htmlFor="price">Harga Spesial (Rp)</Label>
              <Input
                id="price"
                type="number"
                placeholder={`Harga dasar: ${basePrice.toLocaleString("id-ID")}`}
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
                <p className="mt-1 text-xs text-gray-500">Kosongkan atau isi 0 untuk menggunakan harga dasar.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveSettings}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}