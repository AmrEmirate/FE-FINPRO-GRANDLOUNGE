"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { format, startOfMonth, isWithinInterval } from "date-fns"
import { DayPicker, type DateRange, type DayProps } from "react-day-picker"
import { Ban } from "lucide-react"
import "react-day-picker/dist/style.css"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
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
=======
import { DayPicker } from "react-day-picker";
import { addDays, eachDayOfInterval } from "date-fns";
>>>>>>> a5b5c23df089018bf15f5c42a7f3965d8da481cf

// Definisikan tipe untuk props
interface AvailabilityCalendarProps {
<<<<<<< HEAD
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

  // --- PERBAIKAN ZONA WAKTU DI SINI ---
  const availabilityMap = new Map(availabilityData.map(a => {
    // Gunakan string 'YYYY-MM-DD' sebagai kunci Map untuk konsistensi
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
  }, [selectedRange, availabilityData, basePrice, availabilityMap]);

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
      <td {...props}>
        <div
          className={cn(
            "h-full w-full p-0 relative flex flex-col items-center justify-center rounded-md",
            isUnavailable && "text-muted-foreground opacity-70 bg-slate-50 cursor-not-allowed"
          )}
        >
          <span>{format(props.day.date, "d")}</span>
          <div className="text-[10px] mt-1">
            {isUnavailable ? (
              <span className="flex items-center text-red-600 font-semibold">
                <Ban className="h-3 w-3 mr-1" />
                Unavailable
              </span>
            ) : (
              <Badge
                variant={data?.price || (finalPrice && finalPrice !== basePrice) ? "destructive" : "secondary"}
                className="px-1 h-auto leading-tight"
              >
                {finalPrice ? Math.round(finalPrice).toLocaleString("id-ID") : basePrice.toLocaleString("id-ID")}
              </Badge>
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
          onMonthChange={(month) => onMonthChange(startOfMonth(month))}
          numberOfMonths={1}
          components={{ Day: CustomDay }}
          className="border rounded-md p-4 bg-white"
          classNames={{
            day: "h-16 w-16",
            day_range_start: "rounded-l-full",
            day_range_end: "rounded-r-full",
          }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">Drag to select a date range to set a special price.</p>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) setSelectedRange(undefined); 
          setIsDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Price</DialogTitle>
            <DialogDescription>
                Set a special price for the selected date range. To change availability, use the "Set Availability" button.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="text-center font-semibold text-sm">
                {selectedRange?.from && format(selectedRange.from, 'PPP')}
                {selectedRange?.to && ` - ${format(selectedRange.to, 'PPP')}`}
            </div>
            <div>
              <Label htmlFor="price">Special Price (Rp)</Label>
              <Input
                id="price"
                type="number"
                placeholder={`Base price: ${basePrice.toLocaleString("id-ID")}`}
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
                <p className="text-xs text-gray-500 mt-1">Leave empty or set to 0 to use the base price.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
=======
  bookedDates: {
    checkIn: string;
    checkOut: string;
  }[];
}

export function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  // Logika untuk menonaktifkan tanggal yang sudah dipesan
  const disabledDays = bookedDates.flatMap(booking => {
    // Parse tanggal dan pastikan valid
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return [];
    }

    // Buat rentang tanggal dari check-in hingga satu hari sebelum check-out
    return eachDayOfInterval({
      start: checkInDate,
      end: addDays(checkOutDate, -1),
    });
  });

  return (
    <DayPicker
      mode="multiple"
      min={1} // Tampilkan beberapa bulan sekaligus jika perlu
      disabled={disabledDays}
      className="p-4 bg-white rounded-lg shadow"
      classNames={{
        day_disabled: "text-red-500 line-through opacity-50",
      }}
    />
  );
>>>>>>> a5b5c23df089018bf15f5c42a7f3965d8da481cf
}