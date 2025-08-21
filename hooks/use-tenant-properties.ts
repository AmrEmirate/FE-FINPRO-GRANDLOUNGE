"use client"

import { useState, useEffect, useMemo } from "react"

interface Property {
  id: number
  name: string
  category: string
  location: string
  status: "active" | "inactive" | "maintenance"
  rooms: number
  bookings: number
  revenue: number
  image: string
  createdAt: string
}

export function useTenantProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const loadProperties = () => {
      setIsLoading(true)

      // Static data - no API call
      const mockTenantProperties: Property[] = [
        {
          id: 1,
          name: "Luxury Downtown Hotel",
          category: "Hotel",
          location: "Jakarta",
          status: "active",
          rooms: 25,
          bookings: 18,
          revenue: 45000000,
          image: "/luxury-downtown-hotel.png",
          createdAt: "2023-01-15",
        },
        {
          id: 2,
          name: "Seaside Villa Resort",
          category: "Villa",
          location: "Bali",
          status: "active",
          rooms: 12,
          bookings: 10,
          revenue: 38000000,
          image: "/seaside-villa-resort.png",
          createdAt: "2023-02-20",
        },
        {
          id: 3,
          name: "Mountain View Lodge",
          category: "Lodge",
          location: "Bandung",
          status: "maintenance",
          rooms: 8,
          bookings: 5,
          revenue: 15000000,
          image: "/mountain-view-lodge.png",
          createdAt: "2023-03-10",
        },
        {
          id: 4,
          name: "Urban Boutique Hotel",
          category: "Hotel",
          location: "Surabaya",
          status: "active",
          rooms: 15,
          bookings: 12,
          revenue: 28000000,
          image: "/urban-boutique-hotel.png",
          createdAt: "2023-04-05",
        },
        {
          id: 5,
          name: "Cozy Mountain Lodge",
          category: "Lodge",
          location: "Yogyakarta",
          status: "inactive",
          rooms: 6,
          bookings: 2,
          revenue: 8000000,
          image: "/cozy-mountain-lodge.png",
          createdAt: "2023-05-12",
        },
        {
          id: 6,
          name: "Luxurious Villa Resort",
          category: "Villa",
          location: "Lombok",
          status: "active",
          rooms: 20,
          bookings: 16,
          revenue: 52000000,
          image: "/luxurious-villa-resort.png",
          createdAt: "2023-06-18",
        },
      ]

      setProperties(mockTenantProperties)
      setIsLoading(false)
    }

    loadProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    let filtered = properties

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((property) => property.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "revenue-high":
          return b.revenue - a.revenue
        case "revenue-low":
          return a.revenue - b.revenue
        case "bookings-high":
          return b.bookings - a.bookings
        case "bookings-low":
          return a.bookings - b.bookings
        case "date-new":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-old":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [properties, searchTerm, statusFilter, sortBy])

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProperties, currentPage])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)

  const handleDeleteProperty = (propertyId: number) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setProperties((prev) => prev.filter((property) => property.id !== propertyId))
    }
  }

  return {
    properties: paginatedProperties,
    allProperties: properties,
    filteredProperties,
    filteredCount: filteredProperties.length,
    totalCount: properties.length,
    isLoading,
    searchTerm,
    statusFilter,
    sortBy,
    currentPage,
    totalPages,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    setCurrentPage,
    handleDeleteProperty,
  }
}
