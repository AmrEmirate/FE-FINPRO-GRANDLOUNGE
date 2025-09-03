// src/components/home/featured-properties.tsx

"use client"; // Ubah menjadi Client Component

import { useState, useEffect } from 'react';
import { PropertyCard } from "@/components/properties/property-card";
import type { Property } from "@/lib/types";
import Link from "next/link";
import api from '@/utils/api'; // Gunakan api client
import { SearchQuery } from './search-form'; // Impor tipe SearchQuery

// Tambahkan props filter
interface FeaturedPropertiesProps {
  filter: SearchQuery | null;
}

export function FeaturedProperties({ filter }: FeaturedPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // Ambil data dari API
        const response = await api.get('/properties');
        setProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]); // Set ke array kosong jika ada error
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Logika untuk memfilter properti berdasarkan kriteria pencarian
  const filteredProperties = properties.filter(property => {
    if (!filter) {
      return true; // Jika tidak ada filter, tampilkan semua
    }
    const destinationMatch = property.city.name.toLowerCase() === filter.destination.toLowerCase();
    
    // Logika ketersediaan tanggal bisa ditambahkan di sini jika API mendukung
    // Untuk saat ini, kita hanya filter berdasarkan destinasi
    return destinationMatch;
  });

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
        
        {isLoading ? (
            <p className="text-center">Loading properties...</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10">
            <p>No properties found matching your criteria.</p>
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
  );
}