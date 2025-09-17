"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CategoriesPageHeaderProps {
  onAddCategory: () => void;
}

export function CategoriesPageHeader({ onAddCategory }: CategoriesPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Property Categories</h1>
        <p className="text-gray-600 mt-1">Manage your property categories</p>
      </div>
      <Button onClick={onAddCategory}>
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>
  )
}