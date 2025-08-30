"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { PropertyCard } from "./property-card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


interface PropertiesGridProps {
  properties: Property[]
  currentPage: number
  totalPages: number
}

export function PropertiesGrid({ properties, currentPage, totalPages }: PropertiesGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', String(newPage));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/properties${query}`);
  }

  if (properties.length === 0) {
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
             <span className="px-4 py-2 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
