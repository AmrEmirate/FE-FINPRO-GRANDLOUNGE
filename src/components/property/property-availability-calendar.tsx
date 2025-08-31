"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth } from "date-fns"
import { DayPicker, type DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"

interface Availability {
  date: string
  isAvailable: boolean
  price: number
}

interface AvailabilityCalendarProps {
  propertyId: string
  selectedRange: DateRange | undefined
  onSelectRange: (range: DateRange | undefined) => void
}

export function PropertyAvailabilityCalendar({
  propertyId,
  selectedRange,
  onSelectRange,
}: AvailabilityCalendarProps) {
  const { toast } = useToast()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availabilityData, setAvailabilityData] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true)
      try {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth() + 1
        const response = await apiHelper.get(`/properties/${propertyId}/availability?month=${month}&year=${year}`)
        setAvailabilityData(response.data.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch availability data.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAvailability()
  }, [propertyId, currentMonth, toast])
  
  const disabledDays = availabilityData
    .filter(d => !d.isAvailable)
    .map(d => new Date(d.date));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Check Availability & Prices
      </h3>
      <style>{`.rdp-day_unavailable { text-decoration: line-through; color: #9ca3af; }`}</style>
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onSelectRange}
        month={currentMonth}
        // PERBAIKAN DI SINI
        onMonthChange={setCurrentMonth}
        numberOfMonths={2}
        pagedNavigation
        disabled={[{ before: new Date() }, ...disabledDays]}
        modifiers={{
            unavailable: disabledDays,
        }}
        modifiersClassNames={{
            unavailable: 'rdp-day_unavailable',
        }}
        className="w-full flex justify-center"
      />
      <p className="text-sm text-gray-500 mt-4 text-center">
        Harga akan dihitung di sidebar setelah Anda memilih tanggal check-in dan check-out.
      </p>
    </div>
  )
}