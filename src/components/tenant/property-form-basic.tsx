// src/components/tenant/property-form-basic.tsx

"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category, City } from "@/hooks/use-edit-property"

interface Props {
  categories: Category[];
  cities: City[];
  onCityChange: (cityId: string) => void;
}

export function PropertyFormBasic({ categories, cities, onCityChange }: Props) {
  const { control } = useFormContext();

  return (
    <>
      <FormField control={control} name="name" render={({ field }) => (
        <FormItem><FormLabel>Property Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={control} name="categoryId" render={({ field }) => (
          <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="cityId" render={({ field }) => (
          <FormItem><FormLabel>City</FormLabel><Select onValueChange={onCityChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={control} name="zipCode" render={({ field }) => (
        <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </>
  )
}