// src/app/properties/[id]/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import { PropertyImageGallery } from "@/components/property/property-image-gallery"
import { PropertyInfo } from "@/components/property/property-info"
import { RoomSelection } from "@/components/property/room-selection"
import { BookingSidebar } from "@/components/property/booking-sidebar"
import { PropertyAvailabilityCalendar } from "@/components/property/property-availability-calendar"
import type { Property, Room } from "@/lib/types"
import type { DateRange } from "react-day-picker"
import apiHelper from "@/lib/apiHelper"
import { format } from "date-fns"
import { PropertyMap } from "@/components/property/property-map"
import PropertyReviews from "@/components/property/PropertyReviews"

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${id}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return null
  }
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true)
      const data = await getProperty(params.id)
      setProperty(data)
      if (data?.rooms) {
        setAvailableRooms(data.rooms)
        if (data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0])
        }
      }
      setIsLoading(false)
    }
    fetchProperty()
  }, [params.id])

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (selectedRange?.from && selectedRange?.to && property) {
        setIsCheckingAvailability(true)
        setAvailableRooms([])
        setSelectedRoom(null)
        try {
          const checkIn = format(selectedRange.from, "yyyy-MM-dd")
          const checkOut = format(selectedRange.to, "yyyy-MM-dd")

          const response = await apiHelper.get(
            `/properties/${property.id}/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`
          )

          setAvailableRooms(response.data.data)
          if (response.data.data.length > 0) {
            setSelectedRoom(response.data.data[0])
          }
        } catch (error) {
          console.error("Failed to fetch available rooms:", error)
          setAvailableRooms([])
        } finally {
          setIsCheckingAvailability(false)
        }
      }
    }
    fetchAvailableRooms()
  }, [selectedRange, property])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Property Not Found</h1>
        <Link href="/properties"><Button>Back to Properties</Button></Link>
      </div>
    )
  }

  // --- PERBAIKAN DI SINI ---
  // Ganti `img.url` menjadi `img.imageUrl` agar sesuai dengan tipe data yang baru
  const galleryImages = [
    property.mainImage,
    ...(property.images?.map(img => img.imageUrl) || [])
  ].filter(Boolean) as string[]

  // --- PERBAIKAN DI SINI ---
  // Akses latitude & longitude dari `property.city`
  const latitude = property.city?.latitude ? parseFloat(String(property.city.latitude)) : null;
  const longitude = property.city?.longitude ? parseFloat(String(property.city.longitude)) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <PropertyImageGallery images={galleryImages} propertyName={property.name} />
            <PropertyInfo property={property} />

            {latitude && longitude && (
              <PropertyMap 
                latitude={latitude} 
                longitude={longitude} 
                propertyName={property.name} 
              />
            )}

            <PropertyAvailabilityCalendar
              propertyId={property.id}
              selectedRange={selectedRange}
              onSelectRange={setSelectedRange}
            />

            {isCheckingAvailability && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="ml-4">Mengecek ketersediaan kamar...</p>
              </div>
            )}

            {!isCheckingAvailability && (
              <RoomSelection
                rooms={availableRooms}
                selectedRoomId={selectedRoom?.id || null}
                onRoomSelect={setSelectedRoom}
              />
            )}
            
            {property.reviews && property.reviews.length > 0 && (
              <PropertyReviews reviews={property.reviews} />
            )}
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <BookingSidebar
              propertyId={property.id}
              selectedRoom={selectedRoom}
              selectedRange={selectedRange}
              onDateChange={setSelectedRange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}