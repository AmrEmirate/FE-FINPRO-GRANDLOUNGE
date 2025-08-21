"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertySort } from "./property-sort"
import { PropertyFilters } from "./property-filters"
import { Search, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface SearchHeaderProps {
  destination?: string | null
  checkIn?: string | null
  checkOut?: string | null
  propertiesCount: number
  searchTerm: string
  onSearch: (term: string) => void
  onSort: (sortBy: string, order: "asc" | "desc") => void
  onFilter: (filters: any) => void
}

export function SearchHeader({
  destination,
  checkIn,
  checkOut,
  propertiesCount,
  searchTerm,
  onSearch,
  onSort,
  onFilter,
}: SearchHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-4">
          {/* Search Summary */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {destination ? `Properties in ${destination}` : "All Properties"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
              {checkIn && checkOut && (
                <span>
                  {formatDate(checkIn)} - {formatDate(checkOut)}
                </span>
              )}
              <span>•</span>
              <span>{propertiesCount} properties found</span>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <PropertyFilters onFilter={onFilter} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <PropertySort onSort={onSort} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
