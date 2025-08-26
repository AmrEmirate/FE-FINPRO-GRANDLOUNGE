"use client"

import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { mockCategories } from "@/src/lib/constants/mock-data"

interface FormData {
  name: string
  categoryId: string
  description: string
}

interface PropertyBasicInfoProps {
  formData: FormData
  onChange: (field: string, value: string) => void
}

export function PropertyBasicInfo({ formData, onChange }: PropertyBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Property Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          placeholder="Enter property name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.categoryId} onValueChange={(value) => onChange("categoryId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select property category" />
          </SelectTrigger>
          <SelectContent>
            {mockCategories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          required
          placeholder="Describe your property..."
          rows={4}
        />
      </div>
    </div>
  )
}
