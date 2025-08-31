"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth } from "date-fns"
import { DayPicker, type DateRange, type DayProps } from "react-day-picker"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Availability {
  date: string
  isAvailable: boolean
  price?: number
}

interface AvailabilityCalendarProps {
  basePrice: number
  availabilityData: Availability[]
  currentMonth: Date
  onMonthChange: (month: Date) => void
  onSave: (dates: DateRange, isAvailable: boolean, price?: number) => void
}

export function AvailabilityCalendar({
  basePrice,
  availabilityData,
  currentMonth,
  onMonthChange,
  onSave,
}: AvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [price, setPrice] = useState<number>(0)

  const availabilityMap = new Map(availabilityData.map(a => [a.date, a]));

  useEffect(() => {
    if (selectedRange?.from && selectedRange.to) {
      const fromDateString = format(selectedRange.from, "yyyy-MM-dd");
      const fromData = availabilityData.find(d => d.date === fromDateString);
      setIsAvailable(fromData?.isAvailable ?? true);
      setPrice(fromData?.price ?? basePrice);
      setIsDialogOpen(true);
    }
  }, [selectedRange, availabilityData, basePrice]);

  const handleSaveSettings = () => {
    if (selectedRange?.from && selectedRange.to) {
      const range = {
          from: selectedRange.from < selectedRange.to ? selectedRange.from : selectedRange.to,
          to: selectedRange.from < selectedRange.to ? selectedRange.to : selectedRange.from
      }
      onSave(range, isAvailable, price || basePrice)
      setIsDialogOpen(false)
      setSelectedRange(undefined)
    }
  }

  // Komponen kustom untuk merender sel tanggal
  function CustomDay(props: DayProps) {
    // PERBAIKAN: Gunakan props.day.date untuk mengakses tanggal
    const dateString = format(props.day.date, "yyyy-MM-dd");
    const data = availabilityMap.get(dateString);
    const displayPrice = data?.isAvailable ? data.price ?? basePrice : null;
    const isUnavailable = (data && !data.isAvailable) || props.modifiers.disabled;

    return (
      <div
        className={cn(
          "h-14 w-14 p-0 relative flex flex-col items-center justify-center rounded-md",
          props.modifiers.selected && "bg-accent text-accent-foreground",
          isUnavailable && "text-muted-foreground opacity-50 line-through"
        )}
      >
        {/* PERBAIKAN: Gunakan props.day.date untuk memformat tanggal */}
        <span>{format(props.day.date, "d")}</span>
        <div className="text-[10px] mt-1">
          {displayPrice !== null ? (
            <Badge
              variant={data?.price && data.price !== basePrice ? "destructive" : "secondary"}
              className="px-1 h-auto leading-tight"
            >
              {displayPrice.toLocaleString("id-ID")}
            </Badge>
          ) : (
            <Badge variant="outline" className="px-1 h-auto leading-tight bg-slate-100 text-slate-400">
              N/A
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={setSelectedRange}
          month={currentMonth}
          onMonthChange={(month) => onMonthChange(startOfMonth(month))}
          numberOfMonths={1}
          components={{ Day: CustomDay }}
          className="border rounded-md p-4"
          classNames={{
            day: "h-14 w-14 rounded-md", // Pastikan sel bisa diklik
            day_range_start: "rounded-l-full",
            day_range_end: "rounded-r-full",
          }}
        />
        <p className="text-sm text-gray-500 mt-4">Pilih tanggal mulai lalu tanggal selesai untuk mengatur harga atau ketersediaan.</p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
              setSelectedRange(undefined); 
          }
          setIsDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Availability</DialogTitle>
            <DialogDescription>
                Atur harga dan ketersediaan untuk rentang tanggal yang dipilih.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="text-center font-semibold text-sm">
                {selectedRange?.from && format(selectedRange.from, 'PPP')}
                {selectedRange?.to && ` - ${format(selectedRange.to, 'PPP')}`}
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch id="availability-switch" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <Label htmlFor="availability-switch">{isAvailable ? "Available" : "Not Available"}</Label>
            </div>
            {isAvailable && (
              <div>
                <Label htmlFor="price">Special Price (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={`Base price: ${basePrice.toLocaleString("id-ID")}`}
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                 <p className="text-xs text-gray-500 mt-1">Kosongkan atau isi 0 untuk menggunakan harga dasar.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}