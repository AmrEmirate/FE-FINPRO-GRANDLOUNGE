"use client"

import { useState, useEffect, useCallback } from "react"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "./use-toast"
import { eachDayOfInterval, format } from "date-fns"
import { DateRange } from "react-day-picker"

interface Availability {
  date: string
  isAvailable: boolean
  price?: number
}

// Fungsi untuk mendapatkan ketersediaan ruangan
export function useRoomAvailability(propertyId: string, roomId: string) {
  const { toast } = useToast()

  const [availability, setAvailability] = useState<Availability[]>([])
  const [roomName, setRoomName] = useState<string>("")
  const [basePrice, setBasePrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const fetchAvailability = useCallback(async () => {
    if (!roomId || !propertyId) return // Pastikan kedua ID ada

    setIsLoading(true)

    try {
      // Ambil detail ruangan (nama, harga dasar)
      const roomRes = await apiHelper.get(`/properties/my-properties/${propertyId}/rooms/${roomId}`)
      setRoomName(roomRes.data.data.name)
      setBasePrice(roomRes.data.data.basePrice)

      // Ambil data ketersediaan untuk bulan ini
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth() + 1

      const availabilityRes = await apiHelper.get(`/properties/${propertyId}/availability?month=${month}&year=${year}`)
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
  }, [roomId, propertyId, currentMonth, toast])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  const handleSave = async (
    dateRange: DateRange,
    isAvailable: boolean,
    price?: number
  ) => {
    if (!dateRange.from || !dateRange.to) return

    // Membuat array tanggal berdasarkan rentang tanggal yang dipilih
    const dates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    }).map(d => format(d, "yyyy-MM-dd"))

    try {
      // Kirim data ketersediaan
      await apiHelper.post(`/properties/${propertyId}/rooms/${roomId}/availability`, {
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
