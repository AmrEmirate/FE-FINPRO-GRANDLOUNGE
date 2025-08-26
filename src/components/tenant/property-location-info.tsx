"use client"

import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

interface LocationData {
  location: string
  provinsi: string
  zipCode: string
  latitude: string
  longitude: string
}

interface PropertyLocationInfoProps {
  formData: LocationData
  onChange: (field: string, value: string) => void
}

export function PropertyLocationInfo({ formData, onChange }: PropertyLocationInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">City/Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            required
            placeholder="e.g., Jakarta Pusat"
          />
        </div>
        <div>
          <Label htmlFor="provinsi">Province *</Label>
          <Input
            id="provinsi"
            value={formData.provinsi}
            onChange={(e) => onChange("provinsi", e.target.value)}
            required
            placeholder="e.g., DKI Jakarta"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zipCode">Zip Code *</Label>
        <Input
          id="zipCode"
          value={formData.zipCode}
          onChange={(e) => onChange("zipCode", e.target.value)}
          required
          placeholder="e.g., 10220"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="latitude">Latitude (Optional)</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => onChange("latitude", e.target.value)}
            placeholder="e.g., -6.2088"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude (Optional)</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => onChange("longitude", e.target.value)}
            placeholder="e.g., 106.8456"
          />
        </div>
      </div>
    </div>
  )
}
