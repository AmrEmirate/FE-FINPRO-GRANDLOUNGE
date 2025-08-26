"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Calendar, MapPin, Users, Star, Clock, CreditCard } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    memberSince: "January 2023",
  })

  const [upcomingBookings] = useState([
    {
      id: 1,
      propertyName: "Luxury Downtown Hotel",
      location: "Jakarta",
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
      guests: 2,
      status: "confirmed",
      image: "/luxury-downtown-hotel.png",
    },
    {
      id: 2,
      propertyName: "Seaside Villa Resort",
      location: "Bali",
      checkIn: "2024-03-10",
      checkOut: "2024-03-15",
      guests: 4,
      status: "pending",
      image: "/seaside-villa-resort.png",
    },
  ])

  const [recentBookings] = useState([
    {
      id: 3,
      propertyName: "Mountain View Lodge",
      location: "Bandung",
      checkIn: "2024-01-20",
      checkOut: "2024-01-23",
      guests: 2,
      status: "completed",
      rating: 5,
      image: "/mountain-view-lodge.png",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your bookings.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">Next trip in 10 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length + recentBookings.length}</div>
              <p className="text-xs text-muted-foreground">Member since {user.memberSince}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Destinations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Cities visited</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your confirmed and pending reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.propertyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{booking.propertyName}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {booking.checkIn} - {booking.checkOut}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.guests} guests
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                <p className="text-gray-600 mb-4">Start planning your next adventure!</p>
                <Link href="/properties">
                  <Button>Browse Properties</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your completed stays</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.propertyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{booking.propertyName}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {booking.checkIn} - {booking.checkOut}
                      </div>
                      {booking.rating && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {booking.rating}/5 rating given
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
                <p className="text-gray-600">Your completed stays will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
