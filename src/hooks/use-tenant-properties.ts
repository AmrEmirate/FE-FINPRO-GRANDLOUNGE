"use client"

import { useState, useEffect } from "react"
import apiHelper from "@/lib/apiHelper"
import type { Property } from "@/lib/types"
import { useToast } from "./use-toast"

export function useTenantProperties() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      // Di masa mendatang, Anda bisa menambahkan parameter untuk search, sort, dll.
      const response = await apiHelper.get('/properties/my-properties/all');
      setProperties(response.data.data);
      // Logika pagination bisa ditambahkan di sini jika backend mendukungnya
    } catch (error) {
      console.error("Failed to fetch tenant properties:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your properties."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await apiHelper.delete(`/properties/my-properties/${propertyId}`);
        toast({
          title: "Success",
          description: "Property has been deleted."
        });
        // Muat ulang daftar properti setelah menghapus
        fetchProperties();
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete property."
        });
      }
    }
  }

  // Filter sederhana di sisi klien untuk pencarian
  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    properties: filteredProperties, // Kirim properti yang sudah difilter
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages, // Anda perlu mendapatkan ini dari backend nanti
    handleDeleteProperty,
    refetchProperties: fetchProperties // Fungsi untuk memuat ulang data
  }
}
