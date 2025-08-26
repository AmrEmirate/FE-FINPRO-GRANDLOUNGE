"use client"

import { useState } from "react"
import { DashboardStats } from "@/src/components/tenant/dashboard-stats"
import { RecentProperties } from "@/src/components/tenant/recent-properties"

export default function TenantDashboardPage() {
  const [stats] = useState({
    totalProperties: 12,
    totalBookings: 45,
    totalRevenue: 125000,
    occupancyRate: 78,
  })

  const [recentProperties] = useState([
    {
      id: 1,
      name: "Luxury Downtown Hotel",
      location: "Jakarta",
      status: "active",
      bookings: 8,
      revenue: 25000,
      image: "/luxury-downtown-hotel.png",
    },
    {
      id: 2,
      name: "Seaside Villa Resort",
      location: "Bali",
      status: "active",
      bookings: 12,
      revenue: 45000,
      image: "/seaside-villa-resort.png",
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      location: "Bandung",
      status: "maintenance",
      bookings: 5,
      revenue: 15000,
      image: "/mountain-view-lodge.png",
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your properties.</p>
        </div>

        <DashboardStats stats={stats} />
        <RecentProperties properties={recentProperties} />
      </div>
    </div>
  )
}
