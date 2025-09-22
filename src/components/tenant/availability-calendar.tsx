"use client"
import { useState, useEffect } from "react"
import { format, startOfMonth, isWithinInterval } from "date-fns"
import { DayPicker, type DateRange, type DayProps } from "react-day-picker"
import { Ban, XCircle, Clock } from "lucide-react"
import "react-day-picker/dist/style.css"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PeakSeason } from "./PeakSeasonDialog"

interface Availability {
  date: string;
  status: 'AVAILABLE' | 'BOOKED' | 'PENDING' | 'UNAVAILABLE';
  price?: number;
}
interface Props {
  basePrice: number
  availabilityData: Availability[]
  peakSeasons: PeakSeason[]
  currentMonth: Date
  onMonthChange: (month: Date) => void
  onSave: (dates: DateRange, isAvailable: boolean, price?: number) => void
}

export function AvailabilityCalendar({ basePrice, availabilityData, peakSeasons, currentMonth, onMonthChange, onSave }: Props) {
  const [selectedRange, setSelectedRange] = useState<DateRange>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [price, setPrice] = useState<number>(0)

  const availabilityMap = new Map(availabilityData.map(a => [a.date.split("T")[0], a]))

  useEffect(() => {
    const handleRangeSelection = (date: Date) => {
      const key = format(date, "yyyy-MM-dd");
      const data = availabilityMap.get(key);

      const isCurrentlyAvailable = data ? data.status !== 'UNAVAILABLE' : true;
      const currentPrice = data?.price ?? 0;

      setIsAvailable(isCurrentlyAvailable);
      setPrice(currentPrice);
    }

    if (selectedRange?.from) {
      handleRangeSelection(selectedRange.from);
      if (selectedRange.to) {
        setIsDialogOpen(true);
      }
    }
  }, [selectedRange, availabilityMap])

  const applyPeakSeason = (raw: number, date: Date) => {
    if (!peakSeasons || !Array.isArray(peakSeasons)) {
      return raw;
    }
    let curr = raw
    for (const s of peakSeasons) {
      if (isWithinInterval(date, { start: s.startDate, end: s.endDate })) {
        curr = s.adjustmentType === "NOMINAL" ? curr + s.adjustmentValue : curr * (1 + s.adjustmentValue / 100)
        break
      }
    }
    return curr
  }

  const calculateFinalPrice = (date: Date): number | null => {
    const key = format(date, "yyyy-MM-dd")
    const a = availabilityMap.get(key)
    if (a?.status === 'BOOKED' || a?.status === 'PENDING' || a?.status === 'UNAVAILABLE') return null
    const seasonal = applyPeakSeason(basePrice, date)
    return a?.price && a.price > 0 ? a.price : seasonal
  }

  const handleSave = () => {
    if (selectedRange?.from && selectedRange.to) {
      const range = selectedRange.from < selectedRange.to ? { from: selectedRange.from, to: selectedRange.to } : { from: selectedRange.to, to: selectedRange.from }
      onSave(range, isAvailable, price || undefined)
      setIsDialogOpen(false)
      setSelectedRange(undefined)
    }
  }

  function CustomDay(props: DayProps) {
    const dateObj = (props as any).day?.date ?? (props as any).date ?? new Date()
    const key = format(dateObj, "yyyy-MM-dd")
    const data = availabilityMap.get(key)

    const status = data ? data.status : 'AVAILABLE';

    const finalPrice = calculateFinalPrice(dateObj)

    return (
      <td {...(props as any)}>
        <div className={cn(
          "relative flex flex-col justify-between p-3 h-28 w-full rounded-lg border transition-all duration-200",
            props.modifiers.selected && "ring-2 ring-blue-500 ring-offset-2",
          {
            'bg-green-50 text-green-800 hover:bg-green-100': status === 'AVAILABLE',
            'bg-red-50 text-red-800 line-through cursor-not-allowed': status === 'BOOKED',
            'bg-orange-50 text-orange-800 cursor-not-allowed': status === 'PENDING',
            'bg-gray-100 text-gray-400 line-through cursor-not-allowed': status === 'UNAVAILABLE',
          }
        )}>
          
          <span className="font-semibold text-xl self-start">{format(dateObj, "d")}</span>

          <div className="mt-1 text-[10px] font-semibold flex items-center h-4">
            {status === 'AVAILABLE' && (finalPrice !== null ? <Badge variant="secondary">{finalPrice.toLocaleString("id-ID")}</Badge> : '')}
            {status === 'BOOKED' && <><XCircle className="w-3 h-3 mr-1" /> Booked</>}
            {status === 'PENDING' && <><Clock className="w-3 h-3 mr-1" /> Pending</>}
            {status === 'UNAVAILABLE' && <><Ban className="w-3 h-3 mr-1" /> Closed</>}
          </div>
        </div>
      </td>
    )
  }

  return (
    <>
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={setSelectedRange}
          month={currentMonth}
          onMonthChange={m => onMonthChange(startOfMonth(m))}
          numberOfMonths={1}
          components={{ Day: CustomDay as any }}
          className="rounded-md border bg-card p-4"
          classNames={{
            day: "h-16 w-16 p-0",
            day_range_start: "rounded-l-full",
            day_range_end: "rounded-r-full"
          }}
        />
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">Pilih tanggal mulai lalu tanggal selesai untuk mengatur ketersediaan & harga.</p>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-200 mr-2 border border-green-300"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-200 mr-2 border border-red-300"></div>
          <span>Sudah Dipesan (Booked)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-200 mr-2 border border-orange-300"></div>
          <span>Menunggu Pembayaran (Pending)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-200 mr-2 border border-gray-300"></div>
          <span>Tidak Tersedia (Manual)</span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={o => { if (!o) setSelectedRange(undefined); setIsDialogOpen(o) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ketersediaan Manual</DialogTitle>
            <DialogDescription>Atur ketersediaan dan harga spesial untuk rentang tanggal yang dipilih.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-center text-sm font-semibold">
              {selectedRange?.from && format(selectedRange.from, "PPP")}
              {selectedRange?.to && ` - ${format(selectedRange.to, "PPP")}`}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <Label htmlFor="availability">{isAvailable ? "Set as Available" : "Set as Not Available"}</Label>
            </div>
            {isAvailable && (
              <div>
                <Label htmlFor="price">Harga Spesial (Rp)</Label>
                <Input id="price" type="number" value={price || ""} onChange={e => setPrice(Number(e.target.value))} placeholder="Harga dasar (otomatis)" />
                <p className="mt-1 text-xs text-gray-500">Kosongkan/0 untuk memakai harga dasar (termasuk peak season).</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}