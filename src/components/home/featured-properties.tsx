import { PropertyCard } from "@/components/properties/property-card"
import type { Property } from "@/lib/types"
import Link from "next/link";

// Fungsi untuk mengambil data properti di sisi server
async function getFeaturedProperties() {
    try {
        // Kita menggunakan fetch langsung karena ini adalah Server Component
        // Ambil 4 properti pertama sebagai "unggulan"
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties?limit=4`, {
            next: { revalidate: 3600 } // Cache data selama 1 jam
        });

        if (!res.ok) {
            console.error("Failed to fetch properties:", res.statusText);
            return [];
        }

        const data = await res.json();
        return data.data; // Backend Anda membungkus hasil di dalam properti `data`

    } catch (error) {
        console.error("Error fetching featured properties:", error);
        return [];
    }
}


export async function FeaturedProperties() {
  // Panggil fungsi dan tunggu hasilnya
  const featuredProperties: Property[] = await getFeaturedProperties();

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium accommodations
          </p>
        </div>

        {featuredProperties && featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              // Kita menggunakan komponen PropertyCard yang sudah ada
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>Could not load featured properties at the moment. Please try again later.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}