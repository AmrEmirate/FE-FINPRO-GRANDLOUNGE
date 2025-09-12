"use client"

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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Tipe dari PeakSeason mengikuti komponenmu
// { startDate: Date; endDate: Date; adjustmentType: 'NOMINAL' | 'PERCENTAGE'; adjustmentValue: number }
import type { PeakSeason } from "./PeakSeasonDialog"

interface Availability {
  date: string
  isAvailable: boolean
  price?: number;
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
  const [isAvailable, setIsAvailable] = useState(true)
  const [price, setPrice] = useState<number>(0)

  // Normalisasi key tanggal agar aman jika datang dalam format ISO dengan waktu
  const availabilityMap = new Map(
    availabilityData.map((a) => {
      const dateKey = a.date.split("T")[0]
      return [dateKey, a]
    })
  )

  // Prefill dialog saat user selesai memilih TO
  useEffect(() => {
    if (selectedRange?.from && selectedRange.to) {
      const fromKey = format(selectedRange.from, "yyyy-MM-dd")
      const fromData = availabilityMap.get(fromKey)
      setIsAvailable(fromData?.isAvailable ?? true)
      setPrice(fromData?.price ?? 0) // kosong/0 = pakai base/seasonal
      setIsDialogOpen(true)
    } else if (selectedRange?.from && !selectedRange.to) {
      // Saat baru klik FROM, isi default sesuai data hari itu
      const fromKey = format(selectedRange.from, "yyyy-MM-dd")
      const fromData = availabilityMap.get(fromKey)
      setIsAvailable(fromData?.isAvailable ?? true)
      setPrice(fromData?.price ?? 0)
    }
  }, [selectedRange, availabilityMap])

  // Hitung harga dasar + peak season
  const applyPeakSeason = (rawBase: number, date: Date): number => {
    let curr = rawBase
    for (const season of peakSeasons) {
      if (isWithinInterval(date, { start: season.startDate, end: season.endDate })) {
        if (season.adjustmentType === "NOMINAL") {
          curr += season.adjustmentValue
        } else if (season.adjustmentType === "PERCENTAGE") {
          curr *= 1 + season.adjustmentValue / 100
        }
        break // asumsikan satu season aktif per hari, stop pada match pertama
      }
    }
    return curr
  }

  // Aturan harga final yang ditampilkan:
  // 1) Jika availability hari itu isAvailable=false => null (Unavailable)
  // 2) Jika ada price spesial di availability => gunakan price spesial (override peak)
  // 3) Jika tidak ada price spesial => gunakan basePrice yang sudah disesuaikan peak season
  const calculateFinalPrice = (date: Date): number | null => {
    const key = format(date, "yyyy-MM-dd")
    const a = availabilityMap.get(key)
    if (a && a.isAvailable === false) return null

    const seasonalBase = applyPeakSeason(basePrice, date)
    if (a?.price && a.price > 0) {
      return a.price
    }
    return seasonalBase
  }

  const handleSaveSettings = () => {
    if (selectedRange?.from && selectedRange.to) {
      const range =
        selectedRange.from < selectedRange.to
          ? { from: selectedRange.from, to: selectedRange.to }
          : { from: selectedRange.to, to: selectedRange.from }

      // Jika price kosong/0, backend boleh interpretasikan sebagai pakai base/seasonal
      onSave(range, isAvailable, price || undefined)
      setIsDialogOpen(false)
      setSelectedRange(undefined)
    }
  }

  // Custom day cell – root <td> sesuai catatanmu
  function CustomDay(props: DayProps) {
    const dateObj = (props as any).day?.date ?? (props as any).date ?? new Date()
    const key = format(dateObj, "yyyy-MM-dd")
    const data = availabilityMap.get(key)

    const finalPrice = calculateFinalPrice(dateObj)
    const seasonalBase = applyPeakSeason(basePrice, dateObj)
    const isUnavailable = (data && data.isAvailable === false) || props.modifiers?.disabled

    const isSpecial =
      data?.price && data.price > 0 && Math.round(data.price) !== Math.round(seasonalBase)

    return (
      <td {...(props as any)}>
        <div
          className={cn(
            "relative flex h-14 w-14 flex-col items-center justify-center rounded-md p-0",
            isUnavailable && "cursor-not-allowed bg-slate-50 text-muted-foreground opacity-70"
          )}
        >
          <span>{format(dateObj, "d")}</span>
          <div className="mt-1 text-[10px]">
            {isUnavailable ? (
              <span className="flex items-center font-semibold text-red-600">
                <Ban className="mr-1 h-3 w-3" />
                Unavailable
              </span>
            ) : (
              <Badge
                variant={isSpecial ? "destructive" : finalPrice && Math.round(finalPrice) !== Math.round(basePrice) ? "secondary" : "secondary"}
                className="h-auto px-1 leading-tight"
              >
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
          required={false}
          selected={selectedRange}
          onSelect={setSelectedRange}
          month={currentMonth}
          onMonthChange={(m) => onMonthChange(startOfMonth(m))}
          numberOfMonths={1}
          components={{ Day: CustomDay as any }}
          className="rounded-md border bg-white p-4"
          classNames={{
            day: "h-14 w-14 rounded-md",
            day_range_start: "rounded-l-full",
            day_range_end: "rounded-r-full",
          }}
        />
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Pilih tanggal mulai lalu tanggal selesai untuk mengatur harga atau ketersediaan.
      </p>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedRange(undefined)
          setIsDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Availability</DialogTitle>
            <DialogDescription>
              Atur ketersediaan dan harga spesial untuk rentang tanggal yang dipilih.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="text-center text-sm font-semibold">
              {selectedRange?.from && format(selectedRange.from, "PPP")}
              {selectedRange?.to && ` - ${format(selectedRange.to, "PPP")}`}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="availability-switch" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <Label htmlFor="availability-switch">{isAvailable ? "Available" : "Not Available"}</Label>
            </div>

            {isAvailable && (
              <div>
                <Label htmlFor="price">Harga Spesial (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={`Harga dasar (dengan peak): otomatis`}
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Kosongkan atau isi 0 untuk menggunakan harga dasar (termasuk penyesuaian peak season bila ada).
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveSettings}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
//kelebihan