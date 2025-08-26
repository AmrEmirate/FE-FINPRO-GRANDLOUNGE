'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Slider } from '@/src/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'

interface PropertyFiltersProps {
  onFilter: (filters: any) => void
}

export function PropertyFilters({ onFilter }: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [guestCount, setGuestCount] = useState('any')

  const categories = ['Hotel', 'Villa', 'Lodge', 'Apartment', 'Resort']
  const amenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Pet Friendly']

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity])
    } else {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
    }
  }

  const applyFilters = () => {
    const filters = {
      priceRange,
      categories: selectedCategories,
      amenities: selectedAmenities,
      guestCount,
    }
    onFilter(filters)
  }

  const clearFilters = () => {
    setPriceRange([0, 5000000])
    setSelectedCategories([])
    setSelectedAmenities([])
    setGuestCount('any')
    onFilter({})
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-base font-medium mb-3 block">Price Range</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000000}
            min={0}
            step={100000}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Rp {priceRange[0].toLocaleString('id-ID')}</span>
            <span>Rp {priceRange[1].toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <Label className="text-base font-medium mb-3 block">Number of Guests</Label>
        <Select value={guestCount} onValueChange={setGuestCount}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Categories */}
      <div>
        <Label className="text-base font-medium mb-3 block">Property Type</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label className="text-base font-medium mb-3 block">Amenities</Label>
        <div className="space-y-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={amenity} className="text-sm font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  )
}
