"use client"

import { useState, useEffect } from "react"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "./use-toast"

interface Category {
  id: string
  name: string
}

export function useTenantCategories() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await apiHelper.get("/categories")
      setCategories(response.data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch categories.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (name: string) => {
    try {
      await apiHelper.post("/categories", { name })
      toast({ title: "Success", description: "Category created successfully." })
      fetchCategories()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to create category.",
      })
    }
  }

  const handleUpdate = async (id: string, name: string) => {
    try {
      await apiHelper.patch(`/categories/${id}`, { name })
      toast({ title: "Success", description: "Category updated successfully." })
      fetchCategories()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update category.",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await apiHelper.delete(`/categories/${id}`)
        toast({ title: "Success", description: "Category deleted successfully." })
        fetchCategories()
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to delete category.",
        })
      }
    }
  }

  return {
    categories,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}