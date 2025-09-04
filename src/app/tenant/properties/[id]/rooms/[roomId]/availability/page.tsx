"use client"

import { useParams } from "next/navigation"
import { useRoomAvailability } from "@/hooks/use-room-availability"
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RoomAvailabilityPage() {
  const params = useParams()
  const propertyId = params.id as string
  const roomId = params.roomId as string

  const {
    roomName,
    basePrice,
    availability,
    isLoading,
    currentMonth,
    setCurrentMonth,
    handleSave,
  } = useRoomAvailability(propertyId, roomId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/tenant/properties/${propertyId}/rooms`}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Rooms
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Availability & Pricing</h1>
            <p className="text-gray-600 mt-1">Room: {roomName || "Loading..."}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>
              Select dates to set custom prices or mark them as unavailable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading calendar...</p>
            ) : (
              <AvailabilityCalendar
                basePrice={basePrice}
                availabilityData={availability}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                onSave={handleSave}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}