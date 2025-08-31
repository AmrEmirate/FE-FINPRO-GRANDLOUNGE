"use client"

import { useState, useEffect, useCallback } from "react"
import apiHelper from "@/lib/apiHelper"
import type { Property } from "@/lib/types"
import { useToast } from "./use-toast"

export function useTenantProperties() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // State untuk pagination, sorting, dan filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  // Menggunakan useCallback agar fungsi tidak dibuat ulang di setiap render
  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    try {
      // Membuat parameter URL untuk dikirim ke API
      const params = new URLSearchParams({
        search: searchTerm,
        page: page.toString(),
        limit: "6", // Menetapkan 6 properti per halaman
        sortBy,
        sortOrder,
      })
      
      const response = await apiHelper.get(`/properties/my-properties?${params.toString()}`)
      
      setProperties(response.data.data)
      setTotalPages(response.data.pagination.totalPages) // Ambil total halaman dari respons API
    } catch (error) {
      console.error("Failed to fetch tenant properties:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your properties.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, page, sortBy, sortOrder, toast]) // Dependensi untuk useCallback

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties]) // Panggil fetchProperties saat dependensinya berubah

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await apiHelper.delete(`/properties/my-properties/${propertyId}`)
      toast({
        title: "Success",
        description: "Property has been deleted.",
      })
      fetchProperties() // Muat ulang data setelah berhasil menghapus
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete property.",
      })
    }
  }

  return {
    properties,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleDeleteProperty,
    refetchProperties: fetchProperties
  }
}