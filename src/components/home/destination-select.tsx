"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { cities } from "@/src/lib/constants/cities"

interface DestinationSelectProps {
  value: string
  onChange: (value: string) => void
}

export function DestinationSelect({ value, onChange }: DestinationSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
