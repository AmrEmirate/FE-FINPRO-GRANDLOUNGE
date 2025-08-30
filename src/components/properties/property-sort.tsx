'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function PropertySort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const [sort, order] = value.split('-');

    if (!value) {
        current.delete('sort');
        current.delete('order');
    } else {
        current.set('sort', sort);
        current.set('order', order);
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/properties${query}`);
  }
  
  const currentSort = `${searchParams.get('sort') || 'name'}-${searchParams.get('order') || 'asc'}`;

  return (
    <Select onValueChange={handleSortChange} value={currentSort}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="name-asc">Name: A to Z</SelectItem>
        <SelectItem value="name-desc">Name: Z to A</SelectItem>
      </SelectContent>
    </Select>
  )
}
