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
import apiHelper from "@/lib/apiHelper" // Pastikan apiHelper diimpor
import { format } from "date-fns"

// Fungsi untuk mengambil data properti awal (tidak berubah)
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
  
  // --- PERUBAHAN STATE ---
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()

  // Efek untuk mengambil data properti saat pertama kali halaman dimuat
  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true)
      const data = await getProperty(params.id)
      setProperty(data)
      // Awalnya, tampilkan semua kamar
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

  // --- LOGIKA BARU: Efek untuk mengambil kamar yang tersedia saat rentang tanggal berubah ---
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (selectedRange?.from && selectedRange?.to && property) {
        setIsCheckingAvailability(true)
        setAvailableRooms([]) // Kosongkan daftar saat memeriksa
        setSelectedRoom(null) // Reset pilihan kamar
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


  // Tampilan loading awal
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

  const galleryImages = [
    property.mainImage,
    ...(property.images?.map(img => img.imageUrl) || [])
  ].filter(Boolean) as string[]

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
            
            {/* Kalender untuk memilih tanggal */}
            <PropertyAvailabilityCalendar
              propertyId={property.id}
              selectedRange={selectedRange}
              onSelectRange={setSelectedRange}
            />

            {/* Tampilkan loading saat cek ketersediaan */}
            {isCheckingAvailability && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="ml-4">Mengecek ketersediaan kamar...</p>
                </div>
            )}
            
            {/* Hanya tampilkan RoomSelection jika pengecekan selesai */}
            {!isCheckingAvailability && (
              <RoomSelection 
                rooms={availableRooms} // Gunakan state kamar yang tersedia
                selectedRoomId={selectedRoom?.id || null} 
                onRoomSelect={setSelectedRoom} 
              />
            )}
          </div>

          <div className="lg:col-span-1 sticky top-24">
            {/* Sidebar Booking sekarang menerima properti yang sudah difilter */}
            <BookingSidebar 
              selectedRoom={selectedRoom}
              selectedRange={selectedRange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}