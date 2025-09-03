// src/app/properties/page.tsx

import { Suspense } from "react"
import { PropertyFilters } from "@/components/properties/property-filters"
import { SearchHeader } from "@/components/properties/search-header"
import { PropertiesGrid } from "@/components/properties/properties-grid"
import type { Property } from "@/lib/types"
import PropertiesLoading from "./loading" 

interface PaginatedPropertiesResponse {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function getProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<PaginatedPropertiesResponse> {
    const params = new URLSearchParams();
    
    // Loop melalui semua searchParams dan menambahkannya ke URL
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
            // --- PERBAIKAN UTAMA DI SINI ---
            // Jika key dari URL adalah 'q', ubah menjadi 'search' saat dikirim ke API
            if (key === 'q') {
                params.append('search', String(value));
            } else {
                params.append(key, String(value));
            }
        }
    });

    if (!params.has('page')) {
        params.append('page', '1');
    }
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties?${params.toString()}`;
    console.log(`Fetching from API: ${apiUrl}`);

    try {
        const res = await fetch(apiUrl, { 
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error("Failed to fetch properties:", await res.text());
            return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
        }

        const responseData = await res.json();
        return {
            data: responseData.data || [],
            meta: responseData.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
        };

    } catch (error) {
        console.error("Error fetching properties:", error);
        return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
    }
}


export default async function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const { data: properties, meta } = await getProperties(searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div>Loading header...</div>}>
            <SearchHeader 
              propertiesCount={meta.total}
            />
        </Suspense>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-80 md:flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                        <h3 className="text-lg font-semibold mb-4">Filters</h3>
                        <Suspense fallback={<div>Loading filters...</div>}>
                          <PropertyFilters />
                        </Suspense>
                    </div>
                </aside>

                <main className="flex-1">
                  <Suspense fallback={<PropertiesLoading />}>
                    <PropertiesGrid
                        properties={properties || []}
                        currentPage={meta.page}
                        totalPages={meta.totalPages}
                    />
                  </Suspense>
                </main>
            </div>
        </div>
    </div>
  )
}