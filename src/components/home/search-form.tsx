"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { CalendarIcon, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { DestinationSelect } from "./destination-select"
import { DatePicker } from "./date-picker"
import { GuestSelect } from "./guest-select"

export function SearchForm() {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("1")

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) {
      alert("Please fill in all required fields")
      return
    }

    const searchParams = new URLSearchParams({
      destination,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guests,
    })

    router.push(`/properties?${searchParams.toString()}`)
  }

  return (
    <div className="bg-white shadow-lg -mt-20 relative z-10 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 block">
            <MapPin className="inline h-4 w-4 mr-1" />
            Destination
          </Label>
          <DestinationSelect value={destination} onChange={setDestination} />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Check-in
          </Label>
          <DatePicker
            selected={checkIn}
            onSelect={setCheckIn}
            placeholder="Select date"
            disabled={(date) => date < new Date()}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Check-out
          </Label>
          <DatePicker
            selected={checkOut}
            onSelect={setCheckOut}
            placeholder="Select date"
            disabled={(date) => date < (checkIn || new Date())}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            <Users className="inline h-4 w-4 mr-1" />
            Guests
          </Label>
          <GuestSelect value={guests} onChange={setGuests} />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={handleSearch} size="lg" className="px-12">
          Search Properties
        </Button>
      </div>
    </div>
  )
}
