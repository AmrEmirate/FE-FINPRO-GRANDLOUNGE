"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PropertyImageGallery } from "@/components/property/property-image-gallery"
import { PropertyInfo } from "@/components/property/property-info"
import { RoomSelection } from "@/components/property/room-selection"
import { BookingSidebar } from "@/components/property/booking-sidebar"

// Mock property data
const mockProperty = {
  id: 1,
  name: "Grand Lodge Downtown",
  location: "Jakarta Pusat, Jakarta",
  description: "Experience luxury and comfort in the heart of Jakarta.",
  fullDescription:
    "Located in the bustling heart of Jakarta, Grand Lodge Downtown offers an unparalleled blend of luxury, comfort, and convenience.",
  rating: 4.8,
  reviews: 124,
  category: "Hotel",
  images: ["/luxury-hotel-room.png", "/elegant-hotel-lobby.png", "/hotel-restaurant.png", "/hotel-pool.png"],
  amenities: ["WiFi", "Parking", "Pool", "Gym", "Restaurant", "Spa"],
  rooms: [
    {
      id: 1,
      type: "Standard Room",
      price: 850000,
      maxGuests: 2,
      description: "Comfortable room with city view",
      available: true,
    },
    {
      id: 2,
      type: "Deluxe Room",
      price: 1200000,
      maxGuests: 3,
      description: "Spacious room with premium amenities",
      available: true,
    },
  ],
  host: {
    name: "Grand Lodge Management",
    avatar: "/hotel-manager.png",
    joinedDate: "2020-01-15",
    responseRate: 98,
    responseTime: "1 hour",
  },
  policies: {
    checkIn: "15:00",
    checkOut: "12:00",
    cancellation: "Free cancellation up to 24 hours before check-in",
  },
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [property] = useState(mockProperty)
  const [selectedRoom, setSelectedRoom] = useState(property.rooms[0])

  const handleBooking = () => {
    const isAuthenticated = false

    if (!isAuthenticated) {
      router.push("/auth/login?type=user")
      return
    }

    const bookingData = {
      propertyId: property.id,
      roomId: selectedRoom.id,
      price: selectedRoom.price,
    }

    router.push(`/booking?${new URLSearchParams(bookingData).toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PropertyImageGallery images={property.images} propertyName={property.name} />
            <PropertyInfo property={property} />
            <RoomSelection rooms={property.rooms} selectedRoom={selectedRoom} onRoomSelect={setSelectedRoom} />
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar selectedRoom={selectedRoom} onBooking={handleBooking} />
          </div>
        </div>
      </div>
    </div>
  )
}
