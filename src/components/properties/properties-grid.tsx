"use client"

import { PropertyCard } from "./property-card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"

interface PropertiesGridProps {
  properties: Property[]
  isLoading: boolean
  currentPage: number
  onPageChange: (page: number) => void
}

export function PropertiesGrid({ properties, isLoading, currentPage, onPageChange }: PropertiesGridProps) {
  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
          Previous
        </Button>

        <span className="px-4 py-2 text-sm text-gray-700">Page {currentPage}</span>

        <Button variant="outline" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}
