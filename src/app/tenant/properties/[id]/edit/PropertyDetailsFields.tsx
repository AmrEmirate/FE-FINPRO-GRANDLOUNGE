// app/tenant/properties/[id]/edit/PropertyDetailsFields.tsx
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import { PropertyFormValues } from "./PropertyEditForm";

interface Props {
  control: Control<PropertyFormValues>;
  categories: { id: string; name: string }[];
  cities: { id: string; name: string }[];
  amenities: OptionType[];
}

export function PropertyDetailsFields({ control, categories, cities, amenities }: Props) {
  return (
    <div className="space-y-8">
      <FormField control={control} name="name" render={({ field }) => (
        <FormItem><FormLabel>Nama Properti</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid md:grid-cols-2 gap-6">
        <FormField control={control} name="categoryId" render={({ field }) => (
          <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="cityId" render={({ field }) => (
          <FormItem><FormLabel>Kota</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={control} name="zipCode" render={({ field }) => (
        <FormItem><FormLabel>Kode Pos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="amenityIds" render={({ field }) => (
        <FormItem><FormLabel>Fasilitas</FormLabel><FormControl><MultiSelect options={amenities} selected={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
      )} />
    </div>
  );
}