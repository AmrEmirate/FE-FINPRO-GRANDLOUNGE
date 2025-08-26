'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'

interface PropertySortProps {
  onSort: (sortBy: string, order: 'asc' | 'desc') => void
}

export function PropertySort({ onSort }: PropertySortProps) {
  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split('-')
    onSort(sortBy, order as 'asc' | 'desc')
  }

  return (
    <Select onValueChange={handleSortChange} defaultValue="">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="name-asc">Name: A to Z</SelectItem>
        <SelectItem value="name-desc">Name: Z to A</SelectItem>
        <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
        <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
      </SelectContent>
    </Select>
  )
}
