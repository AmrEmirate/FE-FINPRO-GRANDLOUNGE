'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import apiHelper from '@/lib/apiHelper'

interface Category {
  id: string;
  name: string;
}

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  
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
    
    // PERBAIKAN 1: Cek jika value adalah "all" untuk menghapus filter
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

  const clearFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('category');
    current.delete('sort');
    current.delete('order');
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/properties${query}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-3 block">Property Type</Label>
        <Select 
          value={searchParams.get('category') || 'all'} 
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {/* PERBAIKAN 2: Ganti value="" menjadi value="all" */}
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}