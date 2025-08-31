"use client"

import { useState, useEffect } from "react"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "./use-toast"
import { RoomCategory, BedOption } from "@/lib/types"

interface Room {
  id: string
  name: string
  category: RoomCategory
  description: string
  bedOption: BedOption
  capacity: number
  basePrice: number
}

export function useTenantRooms(propertyId: string) {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [propertyName, setPropertyName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchRooms = async () => {
    if (!propertyId) return
    setIsLoading(true)
    try {
      const response = await apiHelper.get(`/properties/my-properties/${propertyId}/rooms`)
      setRooms(response.data.data)
      // Asumsi API properti detail ada di endpoint ini
      const propResponse = await apiHelper.get(`/properties/my-properties/${propertyId}`)
      setPropertyName(propResponse.data.data.name)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch rooms for this property.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [propertyId])

  const handleCreate = async (data: Omit<Room, "id">) => {
    try {
      await apiHelper.post(`/properties/my-properties/${propertyId}/rooms`, data)
      toast({ title: "Success", description: "Room created successfully." })
      fetchRooms()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to create room.",
      })
    }
  }

  const handleUpdate = async (id: string, data: Partial<Room>) => {
    try {
      await apiHelper.patch(`/properties/my-properties/${propertyId}/rooms/${id}`, data)
      toast({ title: "Success", description: "Room updated successfully." })
      fetchRooms()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update room.",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await apiHelper.delete(`/properties/my-properties/${propertyId}/rooms/${id}`)
        toast({ title: "Success", description: "Room deleted successfully." })
        fetchRooms()
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to delete room.",
        })
      }
    }
  }

  return {
    rooms,
    propertyName,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}