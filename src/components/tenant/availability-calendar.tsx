"use client"
import { useState, useEffect } from "react"
import { format, startOfMonth, isWithinInterval } from "date-fns"
import { DayPicker, type DateRange, type DayProps } from "react-day-picker"
import { Ban } from "lucide-react"
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

interface Availability { date: string; isAvailable: boolean; price?: number }
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
    if (selectedRange?.from && selectedRange.to) {
      const key = format(selectedRange.from, "yyyy-MM-dd")
      const data = availabilityMap.get(key)
      setIsAvailable(data?.isAvailable ?? true)
      setPrice(data?.price ?? 0)
      setIsDialogOpen(true)
    } else if (selectedRange?.from) {
      const key = format(selectedRange.from, "yyyy-MM-dd")
      const data = availabilityMap.get(key)
      setIsAvailable(data?.isAvailable ?? true)
      setPrice(data?.price ?? 0)
    }
  }, [selectedRange, availabilityMap])

  const applyPeakSeason = (raw: number, date: Date) => {
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
    if (a && a.isAvailable === false) return null
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
    const finalPrice = calculateFinalPrice(dateObj)
    const seasonal = applyPeakSeason(basePrice, dateObj)
    const isUnavailable = (data && data.isAvailable === false) || props.modifiers?.disabled
    const isSpecial = data?.price && data.price > 0 && Math.round(data.price) !== Math.round(seasonal)
    return (
      <td {...(props as any)}>
        <div className={cn("relative flex h-14 w-14 flex-col items-center justify-center rounded-md", isUnavailable && "cursor-not-allowed bg-slate-50 text-muted-foreground opacity-70")}>
          <span>{format(dateObj, "d")}</span>
          <div className="mt-1 text-[10px]">
            {isUnavailable ? (
              <span className="flex items-center font-semibold text-red-600"><Ban className="mr-1 h-3 w-3" />Unavailable</span>
            ) : (
              <Badge variant={isSpecial ? "destructive" : "secondary"} className="h-auto px-1 leading-tight">
                {(finalPrice ?? basePrice).toLocaleString("id-ID")}
              </Badge>
            )}
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
          className="rounded-md border bg-white p-4"
          classNames={{ day: "h-14 w-14 rounded-md", day_range_start: "rounded-l-full", day_range_end: "rounded-r-full" }}
        />
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">Pilih tanggal mulai lalu tanggal selesai untuk mengatur harga atau ketersediaan.</p>
      <Dialog open={isDialogOpen} onOpenChange={o => { if (!o) setSelectedRange(undefined); setIsDialogOpen(o) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Availability</DialogTitle>
            <DialogDescription>Atur ketersediaan dan harga spesial untuk rentang tanggal yang dipilih.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-center text-sm font-semibold">
              {selectedRange?.from && format(selectedRange.from, "PPP")}
              {selectedRange?.to && ` - ${format(selectedRange.to, "PPP")}`}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <Label htmlFor="availability">{isAvailable ? "Available" : "Not Available"}</Label>
            </div>
            {isAvailable && (
              <div>
                <Label htmlFor="price">Harga Spesial (Rp)</Label>
                <Input id="price" type="number" value={price || ""} onChange={e => setPrice(Number(e.target.value))} placeholder="Harga dasar (otomatis)" />
                <p className="mt-1 text-xs text-gray-500">Kosongkan/0 untuk harga dasar (termasuk peak season).</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
