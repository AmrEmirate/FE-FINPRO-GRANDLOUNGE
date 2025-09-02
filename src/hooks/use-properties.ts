"use client"

import { useState, useEffect, useMemo } from "react"
import type { ReadonlyURLSearchParams } from "next/navigation"
import { mockProperties } from "@/lib/constants/mock-data"
import type { Property, PropertyFilters } from "@/lib/types"

export function useProperties(searchParams: ReadonlyURLSearchParams) {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Partial<PropertyFilters>>({})
  const [sortBy, setSortBy] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const itemsPerPage = 9

  useEffect(() => {
    const loadProperties = () => {
      setIsLoading(true)
      // Direct assignment of mock data without API simulation
      setProperties(mockProperties)
      setIsLoading(false)
    }
    loadProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    let filtered = [...properties]

    // --- PERBAIKAN 2: Ubah cara filter pencarian ---
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // Gunakan property.city.name
          property.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    const destination = searchParams.get("destination")
    if (destination) {
      filtered = filtered.filter(
        (property) =>
          // Gunakan property.city.name
          property.city.name.toLowerCase().includes(destination.toLowerCase()) ||
          // Gunakan property.city.provinsi
          property.city.provinsi.toLowerCase().includes(destination.toLowerCase()),
      )
    }
    // --- AKHIR PERBAIKAN 2 ---

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter((property) => {
        const minPrice =
          property.rooms && property.rooms.length > 0 ? Math.min(...property.rooms.map((room) => room.basePrice)) : 0
        return minPrice >= filters.priceRange![0] && minPrice <= filters.priceRange![1]
      })
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((property) => filters.categories!.includes(property.category.name))
    }

    // Guest count filter
    if (filters.guestCount && filters.guestCount !== "any") {
      const guestCount = Number.parseInt(filters.guestCount)
      filtered = filtered.filter((property) => {
        const maxCapacity =
          property.rooms && property.rooms.length > 0 ? Math.max(...property.rooms.map((room) => room.capacity)) : 0
        return maxCapacity >= guestCount
      })
    }

    // Sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any

        switch (sortBy) {
          case "name":
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case "price":
            aValue = a.rooms && a.rooms.length > 0 ? Math.min(...a.rooms.map((room) => room.basePrice)) : 0
            bValue = b.rooms && b.rooms.length > 0 ? Math.min(...b.rooms.map((room) => room.basePrice)) : 0
            break
          default:
            return 0
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    return filtered
  }, [properties, searchTerm, searchParams, filters, sortBy, sortOrder])

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProperties, currentPage])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)

  const handleFilter = (newFilters: Partial<PropertyFilters>) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSort = (field: string, order: "asc" | "desc") => {
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1)
  }

  return {
    properties: paginatedProperties,
    filteredProperties,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    setSearchTerm,
    setCurrentPage,
    handleFilter,
    handleSort,
  }
}