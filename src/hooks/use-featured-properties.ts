// src/hooks/use-featured-properties.ts

import { useState, useEffect, useMemo } from 'react';
import type { Property } from "@/lib/types";
import api from '@/utils/api';
import { SearchQuery } from '@/components/home/search-form';

export function useFeaturedProperties(filter: SearchQuery | null, categoryFilter: string) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/properties');
        setProperties(response.data.data);
      } catch (err) {
        // Alih-alih console.error, kita set state error
        setError("Gagal memuat properti. Silakan coba lagi nanti.");
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []); // Dependensi kosong agar fetch hanya sekali saat komponen mount

  // Gunakan useMemo agar filtering tidak berjalan di setiap render
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const cityMatch = !filter || property.city.name.toLowerCase() === filter.destination.toLowerCase();
      const categoryMatch = !categoryFilter || property.category.name.toLowerCase() === categoryFilter.toLowerCase();
      return cityMatch && categoryMatch;
    });
  }, [properties, filter, categoryFilter]);

  return { 
    isLoading, 
    error, 
    // Batasi 4 properti di sini
    properties: filteredProperties.slice(0, 4) 
  };
}