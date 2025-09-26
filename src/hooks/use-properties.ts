"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import type { ReadonlyURLSearchParams } from "next/navigation"
import type { Property, PropertyFilters, PaginatedResponse } from "@/lib/types"
import { getProperties } from "@/services/propertyService"

export function useProperties(searchParams: ReadonlyURLSearchParams) {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("order") as "asc" | "desc") || "asc")
  
  const [filters, setFilters] = useState<Partial<PropertyFilters>>({
    priceRange: [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 5000000,
    ],
    categories: searchParams.getAll("category") || [],
  })

  const itemsPerPage = 9

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    const queryParams: { [key: string]: any } = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      order: sortOrder,
    }

    if (searchTerm) {
      queryParams.q = searchTerm
    }
    
    const destination = searchParams.get("destination");
    if (destination) {
        queryParams.location = destination;
    }

    if (filters.priceRange) {
      queryParams.minPrice = filters.priceRange[0]
      queryParams.maxPrice = filters.priceRange[1]
    }

    if (filters.categories && filters.categories.length > 0) {
      queryParams.category = filters.categories.join(",")
    }

    try {
      const result: PaginatedResponse<Property> = await getProperties(queryParams)
      setProperties(result.data || [])
      setTotalPages(result.meta.totalPages || 1)
      setTotalProperties(result.meta.total || 0)
    } catch (error) {
      console.error("Failed to fetch properties:", error)
      setProperties([])
      setTotalPages(1)
      setTotalProperties(0)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm, sortBy, sortOrder, filters, searchParams])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

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
    properties,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    totalProperties,
    setSearchTerm,
    setCurrentPage,
    handleFilter,
    handleSort,
  }
}