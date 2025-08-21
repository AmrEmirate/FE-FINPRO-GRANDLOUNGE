"use client"

import { PropertiesHeader } from "@/components/tenant/properties-header"
import { PropertiesGrid } from "@/components/tenant/properties-grid"
import { useTenantProperties } from "@/hooks/use-tenant-properties"

export default function TenantPropertiesPage() {
  const {
    properties,
    filteredProperties,
    searchTerm,
    statusFilter,
    sortBy,
    currentPage,
    totalPages,
    isLoading,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    setCurrentPage,
    handleDeleteProperty,
  } = useTenantProperties()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertiesHeader
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSortBy}
        />

        <PropertiesGrid
          properties={filteredProperties}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          onDeleteProperty={handleDeleteProperty}
        />
      </div>
    </div>
  )
}
