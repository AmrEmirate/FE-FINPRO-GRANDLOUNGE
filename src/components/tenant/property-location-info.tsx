"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipe data untuk kota (dari API)
interface City {
  id: string;
  name: string;
}

// Tipe data untuk bagian form ini
interface LocationData {
  cityId: string;
  zipCode: string;
}

// Definisikan props yang diterima komponen
interface PropertyLocationInfoProps {
  formData: LocationData;
  updateFormData: (updates: Partial<LocationData>) => void;
  cities: City[];
}

export function PropertyLocationInfo({ formData, updateFormData, cities }: PropertyLocationInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="cityId">City *</Label>
          <Select
            value={formData.cityId}
            onValueChange={(value) => updateFormData({ cityId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode">Zip Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
            required
            placeholder="e.g., 10220"
          />
        </div>
      </div>
    </div>
  )
}