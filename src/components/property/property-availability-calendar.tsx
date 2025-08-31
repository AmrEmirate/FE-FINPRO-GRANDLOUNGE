"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { DayPicker, type DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { Badge } from "@/components/ui/badge"
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
        const response = await apiHelper.get(
          `/properties/${propertyId}/availability?month=${month}&year=${year}`
        )
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

  const availabilityMap = new Map(availabilityData.map(a => [a.date, a]))

  const disabledDays = availabilityData
    .filter(d => !d.isAvailable)
    .map(d => new Date(d.date))

  const DayContent = (props: { date: Date }) => {
    const dateString = format(props.date, "yyyy-MM-dd")
    const data = availabilityMap.get(dateString)

    if (!data?.isAvailable) {
      return <div className="line-through text-gray-400">{format(props.date, "d")}</div>
    }

    return (
      <div className="flex flex-col items-center">
        <span>{format(props.date, "d")}</span>
        {data?.price && (
          <Badge variant="secondary" className="text-[10px] p-0.5 px-1 h-auto leading-tight">
            {data.price.toLocaleString("id-ID")}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Check Availability & Prices
      </h3>
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onSelectRange}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        numberOfMonths={2}
        pagedNavigation
        disabled={[{ before: new Date() }, ...disabledDays]}
        components={{
          Day: ({ day }) => <DayContent date={day as unknown as Date} />,
        }}
        className="w-full flex justify-center"
      />
    </div>
  )
}
