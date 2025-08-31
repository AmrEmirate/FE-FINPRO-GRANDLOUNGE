"use client"

import { useState } from "react"
import { DashboardStats } from "@/components/tenant/dashboard-stats" 
import { RecentProperties } from "@/components/tenant/recent-properties"
// 1. Impor tipe data yang diperlukan, termasuk enum
import type { Property } from "@/lib/types" 
import { RoomCategory, BedOption } from "@/lib/types"

export default function TenantDashboardPage() {
  const [stats] = useState({
    totalProperties: 12,
    totalBookings: 45,
    totalRevenue: 125000,
    occupancyRate: 78,
    totalRooms: 250,
    activeListings: 10,
    monthlyViews: 5000,
  })

  // 2. Gunakan enum saat mendefinisikan data mock
  const [recentProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Luxury Downtown Hotel",
      mainImage: "/luxury-downtown-hotel.png",
      createdAt: "2023-01-01T00:00:00.000Z",
      city: { id: "1", name: "Jakarta", provinsi: "DKI Jakarta" },
      category: { id: "1", name: "Hotel" },
      rooms: [{ 
        id: "1", 
        basePrice: 1200000, 
        capacity: 2, 
        name: "Deluxe", 
        category: RoomCategory.DELUXE, // Gunakan enum
        bedOption: BedOption.DOUBLE,    // Gunakan enum
        description: "", 
        propertyId: "1" 
      }],
      tenantId: "1",
      description: "",
      deletedAt: undefined,
      tenant: { user: { fullName: "" }, createdAt: "" },
    },
    {
      id: "2",
      name: "Seaside Villa Resort",
      mainImage: "/seaside-villa-resort.png",
      createdAt: "2023-02-15T00:00:00.000Z",
      city: { id: "2", name: "Bali", provinsi: "Bali" },
      category: { id: "2", name: "Villa" },
      rooms: [{ 
        id: "2", 
        basePrice: 2500000, 
        capacity: 4, 
        name: "Private Villa", 
        category: RoomCategory.SUITE, // Gunakan enum
        bedOption: BedOption.DOUBLE,   // Gunakan enum
        description: "", 
        propertyId: "2" 
      }],
      tenantId: "2",
      description: "",
      deletedAt: undefined,
      tenant: { user: { fullName: "" }, createdAt: "" },
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