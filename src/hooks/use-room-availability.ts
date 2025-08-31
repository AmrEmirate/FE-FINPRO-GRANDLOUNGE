"use client"

import { useState, useEffect } from "react"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "./use-toast"
import { eachDayOfInterval, format } from "date-fns"
import { DateRange } from "react-day-picker"

interface Availability {
  date: string
  isAvailable: boolean
  price?: number
}

export function useRoomAvailability(roomId: string) {
  const { toast } = useToast()
  const [availability, setAvailability] = useState<Availability[]>([])
  const [roomName, setRoomName] = useState<string>("")
  const [basePrice, setBasePrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const fetchAvailability = async () => {
    if (!roomId) return
    setIsLoading(true)
    try {
      // Fetch room details to get name and base price
      const roomRes = await apiHelper.get(`/rooms/${roomId}`) // Asumsi endpoint ini ada
      setRoomName(roomRes.data.data.name)
      setBasePrice(roomRes.data.data.basePrice)

      // Fetch availability for the current month
      const month = format(currentMonth, "yyyy-MM")
      const availabilityRes = await apiHelper.get(`/rooms/${roomId}/availability?month=${month}`)
      setAvailability(availabilityRes.data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch room availability data.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability()
  }, [roomId, currentMonth])

  const handleSave = async (
    dateRange: DateRange,
    isAvailable: boolean,
    price?: number
  ) => {
    if (!dateRange.from || !dateRange.to) return
    
    // Create an array of dates in the selected range
    const dates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    }).map(d => format(d, 'yyyy-MM-dd'));

    try {
      await apiHelper.post(`/rooms/${roomId}/availability`, {
        dates,
        isAvailable,
        price: isAvailable ? (price || basePrice) : undefined,
      })
      toast({ title: "Success", description: "Availability updated successfully." })
      fetchAvailability() // Refresh data
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update availability.",
      })
    }
  }

  return {
    roomName,
    basePrice,
    availability,
    isLoading,
    currentMonth,
    setCurrentMonth,
    handleSave,
  }
}