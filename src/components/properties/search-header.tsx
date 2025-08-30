"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertySort } from "./property-sort"
import { PropertyFilters } from "./property-filters"
import { Search, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"

interface SearchHeaderProps {
  propertiesCount: number
}

export function SearchHeader({ propertiesCount }: SearchHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  // Fungsi untuk update URL dengan parameter baru
  const updateQueryParams = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    // Reset halaman ke 1 setiap kali ada filter baru
    current.set('page', '1');

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/properties${query}`);
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      updateQueryParams('q', searchTerm);
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchParams.get("destination") ? `Properties in ${searchParams.get("destination")}` : "All Properties"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">{propertiesCount} properties found</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </form>

            <div className="flex gap-2">
              <Sheet>
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
                    <PropertyFilters />
                  </div>
                </SheetContent>
              </Sheet>

              <PropertySort />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

