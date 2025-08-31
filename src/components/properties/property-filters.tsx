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
    
    // Jika user memilih placeholder, value akan menjadi string kosong
    // dan kita hapus parameter filter dari URL
    if (!value) {
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
    router.push('/properties');
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-3 block">Property Type</Label>
        <Select 
          value={searchParams.get('category') || ''} 
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            {/* Placeholder ini akan ditampilkan saat value adalah string kosong */}
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {/* Hapus <SelectItem> dengan value kosong */}
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
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