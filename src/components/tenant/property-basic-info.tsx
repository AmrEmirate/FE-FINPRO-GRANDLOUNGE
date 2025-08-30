"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipe data untuk kategori (dari API)
interface Category {
  id: string;
  name: string;
}

// Tipe data untuk bagian form ini
interface BasicInfoData {
  name: string;
  categoryId: string;
  description: string;
}

// Definisikan props yang diterima komponen
interface PropertyBasicInfoProps {
  formData: BasicInfoData;
  updateFormData: (updates: Partial<BasicInfoData>) => void;
  categories: Category[];
}

export function PropertyBasicInfo({ formData, updateFormData, categories }: PropertyBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Property Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          required
          placeholder="Enter property name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => updateFormData({ categoryId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select property category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
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
          onChange={(e) => updateFormData({ description: e.target.value })}
          required
          placeholder="Describe your property..."
          rows={4}
        />
      </div>
    </div>
  )
}