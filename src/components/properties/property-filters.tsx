// src/components/properties/property-filters.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input' // Impor komponen Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import apiHelper from '@/lib/apiHelper'
import { formatCurrency } from '@/lib/utils/format'

interface Category {
  id: string;
  name: string;
}

// Ubah tipe state untuk menyimpan min & max secara terpisah
interface PriceRange {
  min: number | string;
  max: number | string;
}

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: searchParams.get('minPrice') || '', 
    max: searchParams.get('maxPrice') || ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiHelper.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (!value || value === "all") {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    
    current.set('page', '1');
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/properties${query}`);
  };
  
  // Fungsi untuk menangani perubahan pada input harga
  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Hanya izinkan angka
    const numericValue = value.replace(/[^0-9]/g, '');
    setPriceRange(prev => ({ ...prev, [name]: numericValue }));
  };

  // Fungsi untuk menerapkan filter harga
  const applyPriceFilter = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (priceRange.min) {
      current.set('minPrice', String(priceRange.min));
    } else {
      current.delete('minPrice');
    }
    
    if (priceRange.max) {
      current.set('maxPrice', String(priceRange.max));
    } else {
      current.delete('maxPrice');
    }

    current.set('page', '1');
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/properties${query}`);
  }

  const clearFilters = () => {
    router.push(`/properties`);
    setPriceRange({ min: '', max: '' });
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-3 block">Tipe Properti</Label>
        <Select 
          value={searchParams.get('category') || 'all'} 
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ganti Slider dengan Input Manual */}
      <div className="pt-4 border-t">
        <Label className="text-base font-medium mb-3 block">Rentang Harga</Label>
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <Label htmlFor="min" className="text-xs text-gray-500">Harga Minimum</Label>
                <Input
                    id="min"
                    name="min"
                    type="text"
                    placeholder="Rp 0"
                    value={priceRange.min}
                    onChange={handlePriceInputChange}
                    className="mt-1"
                />
            </div>
             <div className="flex-1">
                <Label htmlFor="max" className="text-xs text-gray-500">Harga Maksimum</Label>
                <Input
                    id="max"
                    name="max"
                    type="text"
                    placeholder="Rp 10.000.000+"
                    value={priceRange.max}
                    onChange={handlePriceInputChange}
                    className="mt-1"
                />
            </div>
        </div>
        <Button onClick={applyPriceFilter} size="sm" className="w-full mt-4">
          Terapkan Harga
        </Button>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Hapus Semua Filter
        </Button>
      </div>
    </div>
  )
}