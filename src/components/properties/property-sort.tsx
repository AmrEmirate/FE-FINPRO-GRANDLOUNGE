'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PropertySort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = `${searchParams.get('sortBy') || 'name'}-${searchParams.get('order') || 'asc'}`;

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Pecah nilai value menjadi sortBy dan order
    const [sortBy, order] = value.split('-');

    if (sortBy && order) {
      current.set('sortBy', sortBy);
      current.set('order', order);
    } else {
      // Jika value tidak valid, hapus parameter sort
      current.delete('sortBy');
      current.delete('order');
    }

    // Selalu reset ke halaman pertama saat sorting diubah
    current.set('page', '1');

    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Gunakan router untuk navigasi ke URL baru
    router.push(`/properties${query}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
        <SelectItem value="price-asc">Price (Low to High)</SelectItem>
        <SelectItem value="price-desc">Price (High to Low)</SelectItem>
      </SelectContent>
    </Select>
  )
}