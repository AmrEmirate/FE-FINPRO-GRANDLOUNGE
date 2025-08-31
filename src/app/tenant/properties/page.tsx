"use client"

import { useTenantProperties } from "@/hooks/use-tenant-properties"
import { PropertiesHeader } from "@/components/tenant/properties-header"
import { PropertiesGrid } from "@/components/tenant/properties-grid"
import { PaginationControls } from "@/components/tenant/pagination-controls" 

export default function TenantPropertiesPage() {
  const {
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
  } = useTenantProperties()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertiesHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        <div className="mt-8">
          {isLoading ? (
            <p>Loading properties...</p> // Tampilan loading
          ) : (
            <PropertiesGrid
              properties={properties}
              searchTerm={searchTerm}
              onDeleteProperty={handleDeleteProperty}
            />
          )}
        </div>

        {/* Tambahkan Kontrol Pagination di sini */}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  )
}