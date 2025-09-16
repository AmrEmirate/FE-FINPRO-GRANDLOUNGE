// src/components/home/featured-properties.tsx

"use client"; 

import { useState, useEffect } from 'react';
import { PropertyCard } from "@/components/properties/property-card";
import type { Property } from "@/lib/types";
import Link from "next/link";
import api from '@/utils/api'; 
import { SearchQuery } from './search-form'; 

// Tambahkan props categoryFilter
interface FeaturedPropertiesProps {
  filter: SearchQuery | null;
  categoryFilter: string; // prop baru untuk filter kategori
}

export function FeaturedProperties({ filter, categoryFilter }: FeaturedPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/properties');
        setProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // --- MODIFIKASI LOGIKA FILTER DI SINI ---
  const filteredProperties = properties
    .filter(property => {
      // Filter berdasarkan search form (destinasi, dll)
      if (!filter) return true;
      return property.city.name.toLowerCase() === filter.destination.toLowerCase();
    })
    .filter(property => {
      // Filter tambahan berdasarkan kategori dari navbar
      if (!categoryFilter) return true;
      return property.category.name.toLowerCase() === categoryFilter.toLowerCase();
    });
  // --- AKHIR MODIFIKASI ---

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {/* Judul dinamis berdasarkan filter */}
            {categoryFilter ? `${categoryFilter} Pilihan` : "Properti Pilihan"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan pilihan akomodasi premium dari kami
          </p>
        </div>
        
        {isLoading ? (
            <p className="text-center">Memuat properti...</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.slice(0, 4).map((property) => ( // Batasi hanya 4 properti
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10">
            <p>Tidak ada properti yang sesuai dengan kriteria Anda.</p>
          </div>
        )}

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