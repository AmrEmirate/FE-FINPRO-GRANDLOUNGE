// src/components/home/featured-properties.tsx

"use client";

import { PropertyCard } from "@/components/properties/property-card";
import Link from "next/link";
import { SearchQuery } from './search-form';
// 1. Import hook yang baru dibuat
import { useFeaturedProperties } from '@/hooks/use-featured-properties';

interface FeaturedPropertiesProps {
  filter: SearchQuery | null;
  categoryFilter: string;
}

// Komponen Pembantu untuk UI
const LoadingState = () => <p className="text-center">Memuat properti...</p>;

const EmptyState = () => (
  <div className="text-center text-gray-600 py-10">
    <p>Tidak ada properti yang sesuai dengan kriteria Anda.</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center text-red-600 py-10">
    <p>{message}</p>
  </div>
);


export function FeaturedProperties({ filter, categoryFilter }: FeaturedPropertiesProps) {
  // 2. Gunakan custom hook untuk mendapatkan data dan state
  const { properties, isLoading, error } = useFeaturedProperties(filter, categoryFilter);

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (properties.length === 0) return <EmptyState />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {categoryFilter ? `${categoryFilter} Pilihan` : "Properti Pilihan"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan pilihan akomodasi premium dari kami
          </p>
        </div>
        
        {/* 3. Tampilan menjadi lebih bersih */}
        {renderContent()}

        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Lihat Semua Properti
          </Link>
        </div>
      </div>
    </section>
  );
}