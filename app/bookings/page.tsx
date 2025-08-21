"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Phone } from "lucide-react"

export default function BookingsPage() {
  const [bookings] = useState([
    {
      id: 1,
      propertyName: "Grand Lodge Downtown",
      location: "Jakarta Pusat",
      checkIn: "2024-02-15",
      checkOut: "2024-02-17",
      guests: 2,
      totalPrice: 1700000,
      status: "confirmed",
      image: "/luxury-downtown-hotel.png",
      bookingDate: "2024-01-15",
      contactPhone: "+62 21 1234 5678",
      contactEmail: "info@grandlodge.com",
    },
    {
      id: 2,
      propertyName: "Seaside Villa Resort",
      location: "Seminyak, Bali",
      checkIn: "2024-01-20",
      checkOut: "2024-01-25",
      guests: 4,
      totalPrice: 12500000,
      status: "completed",
      image: "/seaside-villa-resort.png",
      bookingDate: "2023-12-10",
      contactPhone: "+62 361 123456",
      contactEmail: "info@seaside.com",
    },
    {
      id: 3,
      propertyName: "Mountain View Lodge",
      location: "Lembang, Bandung",
      checkIn: "2024-03-10",
      checkOut: "2024-03-12",
      guests: 3,
      totalPrice: 1300000,
      status: "upcoming",
      image: "/mountain-view-lodge.png",
      bookingDate: "2024-02-01",
      contactPhone: "+62 22 123456",
      contactEmail: "info@mountainlodge.com",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={booking.image || "/placeholder.svg"}
            alt={booking.propertyName}
            className="w-full md:w-32 h-32 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {booking.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {booking.checkIn} - {booking.checkOut}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {booking.guests} guests
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-lg font-bold text-blue-600">Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                <p className="text-sm text-gray-500">Booked on {booking.bookingDate}</p>
              </div>

              <div className="mt-2 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {booking.status === "upcoming" && (
                  <Button variant="outline" size="sm">
                    Modify Booking
                  </Button>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{booking.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your accommodation bookings</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div>
              {filterBookings("all").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div>
              {filterBookings("upcoming").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="confirmed">
            <div>
              {filterBookings("confirmed").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div>
              {filterBookings("completed").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="text-center py-12">
              <p className="text-gray-600">No cancelled bookings found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
