"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GuestSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string;
}

export function GuestSelect({ value, onChange }: GuestSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select guests" />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {num} {num === 1 ? "Guest" : "Guests"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
