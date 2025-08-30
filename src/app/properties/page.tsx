import { Suspense } from "react"
import { PropertyFilters } from "@/components/properties/property-filters"
import { SearchHeader } from "@/components/properties/search-header"
import { PropertiesGrid } from "@/components/properties/properties-grid"
import type { Property } from "@/lib/types"

// Tipe data untuk hasil API yang menyertakan pagination
interface PaginatedPropertiesResponse {
  data: Property[];
  currentPage: number;
  totalPages: number;
  totalProperties: number;
}

// Fungsi untuk mengambil data properti dari backend
async function getProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<PaginatedPropertiesResponse> {
    const params = new URLSearchParams();
    
    // Menambahkan parameter pencarian, filter, sort, dan pagination
    if (searchParams.q) params.append('q', String(searchParams.q));
    if (searchParams.category) params.append('categoryId', String(searchParams.category));
    if (searchParams.sort) params.append('sort', String(searchParams.sort));
    if (searchParams.order) params.append('order', String(searchParams.order));
    if (searchParams.page) params.append('page', String(searchParams.page));
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties?${params.toString()}`;

    try {
        const res = await fetch(apiUrl, { 
            cache: 'no-store' // Tidak menggunakan cache agar data selalu terbaru
        });

        if (!res.ok) {
            console.error("Failed to fetch properties:", await res.text());
            return { data: [], currentPage: 1, totalPages: 1, totalProperties: 0 };
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching properties:", error);
        return { data: [], currentPage: 1, totalPages: 1, totalProperties: 0 };
    }
}


// Ini adalah Server Component utama untuk halaman properti
export default async function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const { data: properties, currentPage, totalPages, totalProperties } = await getProperties(searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div>Loading header...</div>}>
            <SearchHeader 
              propertiesCount={totalProperties}
            />
        </Suspense>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filter Sidebar */}
                <div className="w-full md:w-80 md:flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                        <h3 className="text-lg font-semibold mb-4">Filters</h3>
                        {/* Memanggil komponen PropertyFilters di sini */}
                        <PropertyFilters />
                    </div>
                </div>

                {/* Property Grid */}
                <div className="flex-1">
                    <PropertiesGrid
                        properties={properties || []}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

