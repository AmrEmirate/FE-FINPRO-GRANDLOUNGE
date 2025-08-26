"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PropertyFilters } from "@/src/components/properties/property-filters"
import { SearchHeader } from "@/src/components/properties/search-header"
import { PropertiesGrid } from "@/src/components/properties/properties-grid"
import { useProperties } from "@/src/hooks/use-properties"

function PropertiesContent() {
  const searchParams = useSearchParams()
  const {
    properties,
    filteredProperties,
    isLoading,
    searchTerm,
    currentPage,
    setSearchTerm,
    setCurrentPage,
    handleFilter,
    handleSort,
  } = useProperties(searchParams)

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        destination={searchParams.get("destination")}
        checkIn={searchParams.get("checkIn")}
        checkOut={searchParams.get("checkOut")}
        propertiesCount={filteredProperties?.length || 0}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onSort={handleSort}
        onFilter={handleFilter}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <PropertyFilters onFilter={handleFilter} />
            </div>
          </div>

          <PropertiesGrid
            properties={properties || []}
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  )
}
