"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Calendar } from "@/src/components/ui/calendar"
import { format } from "date-fns"

interface BookingSidebarProps {
  selectedRoom: {
    id: number
    type: string
    price: number
    description: string
    available: boolean
  }
  onBooking: () => void
}

export function BookingSidebar({ selectedRoom, onBooking }: BookingSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleBookingClick = () => {
    if (!selectedDate) {
      alert("Please select a check-in date")
      return
    }
    onBooking()
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Stay</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">Rp {selectedRoom.price.toLocaleString("id-ID")}</div>
            <div className="text-sm text-gray-600">/night</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Selected Room</h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium">{selectedRoom.type}</div>
            <div className="text-sm text-gray-600">{selectedRoom.description}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Select Check-in Date</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />

          {selectedDate && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <div className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
              <div className="text-blue-600">Price: Rp {selectedRoom.price.toLocaleString("id-ID")}/night</div>
            </div>
          )}
        </div>

        <Button onClick={handleBookingClick} className="w-full" size="lg" disabled={!selectedRoom.available}>
          {selectedRoom.available ? "Book Now" : "Not Available"}
        </Button>

        <div className="text-xs text-gray-500 text-center">You won't be charged yet</div>
      </CardContent>
    </Card>
  )
}
