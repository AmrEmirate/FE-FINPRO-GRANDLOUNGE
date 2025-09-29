"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { differenceInCalendarDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import type { Room } from "@/lib/types"
import { useAuth } from "@/context/AuthContext"

export function BookingSidebar({
  selectedRange,
  onDateChange,
  selectedRoom,
  propertyId,
}: {
  selectedRange: DateRange | undefined
  onDateChange: (range: DateRange | undefined) => void
  selectedRoom: Room | null
  propertyId: string
}) {
  const router = useRouter()
  const { user } = useAuth()

  const nights = useMemo(() => {
    if (selectedRange?.from && selectedRange?.to) {
      const diff = differenceInCalendarDays(selectedRange.to, selectedRange.from);
      return diff > 0 ? diff : 0;
    }
    return 0
  }, [selectedRange])

  const pricePerNight = useMemo(() => {
    if (selectedRoom?.totalPrice && nights > 0) {
      return selectedRoom.totalPrice / nights;
    }
    return selectedRoom?.basePrice || 0;
  }, [selectedRoom, nights]);

  const handleReserve = () => {
    if (!user) {
      toast.error("Please login to make a reservation.")
      router.push('/auth/login')
      return
    }
    if (nights > 0 && selectedRoom) {
      const query = new URLSearchParams({
        propertyId,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkIn: format(selectedRange!.from!, 'yyyy-MM-dd'),
        checkOut: format(selectedRange!.to!, 'yyyy-MM-dd'),
        guests: "1",
        totalPrice: String(selectedRoom.totalPrice),
        nights: String(nights),
      }).toString();
      
      router.push(`/room_reservation?${query}`)
    } else {
      toast.error("Please select a valid date range and a room.")
    }
  }

  if (!selectedRange?.from || !selectedRoom) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
          <h3 className="font-bold">Pilih tanggal dan kamar</h3>
          <p className="text-sm text-gray-600 mt-2">
            Silakan pilih tanggal menginap dan jenis kamar untuk melihat rincian harga.
          </p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <div className="text-2xl font-bold">
        <span className="text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(pricePerNight)}
        </span>
        <span className="text-base font-normal text-gray-600"> / night</span>
      </div>

      <div className="mt-4 grid gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedRange?.from ? (
                selectedRange.to ? (
                  <>
                    {format(selectedRange.from, "LLL dd, y")} -{" "}
                    {format(selectedRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(selectedRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {nights > 0 && selectedRoom?.totalPrice !== undefined && (
        <>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-gray-700">
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(pricePerNight)}{" "}
                x {nights} nights
              </p>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(selectedRoom.totalPrice)}
              </p>
            </div>
            {selectedRoom && (
                <div className="mt-2 text-sm text-gray-600">
                    Untuk: <strong>{selectedRoom.name}</strong>
                </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t font-bold text-lg flex justify-between">
            <p>Total</p>
            <p>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(selectedRoom.totalPrice)}
            </p>
          </div>
        </>
      )}

      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={handleReserve}
        disabled={nights <= 0 || !selectedRoom || !user}
      >
        Reserve
      </Button>

      {!user && nights > 0 && selectedRoom && (
        <p className="mt-4 text-center text-sm text-red-600">
          You must be logged in to make a reservation.
        </p>
      )}
    </div>
  )
}