// app/tenant/properties/[id]/edit/PropertyImageFields.tsx
import { Control } from "react-hook-form";
import Image from "next/image";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/tenant/image-upload";
import { Trash2 } from "lucide-react";
import { PropertyFormValues } from "./PropertyEditForm";

interface PropertyData {
  mainImage: string | null;
  images: { id: string; imageUrl: string }[];
}

interface Props {
  control: Control<PropertyFormValues>;
  property: PropertyData | null;
  onDeleteImage: (id: string) => void;
}

export function PropertyImageFields({ control, property, onDeleteImage }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <FormLabel>Gambar Utama Saat Ini</FormLabel>
        {property?.mainImage ? (
          <div className="mt-2 relative w-48 h-48">
            <Image src={property.mainImage} alt="Gambar utama" fill className="object-cover rounded-md" />
          </div>
        ) : <p className="text-sm text-gray-500 mt-2">Tidak ada gambar utama.</p>}
      </div>
      <FormField control={control} name="mainImage" render={({ field }) => (
        <FormItem><FormLabel>Unggah Gambar Utama Baru (Opsional)</FormLabel><FormControl><ImageUpload files={field.value ? [field.value] : []} onFilesChange={(files) => field.onChange(files[0])} maxFiles={1} /></FormControl><FormMessage /></FormItem>
      )} />
      <div>
        <FormLabel>Galeri Gambar Saat Ini</FormLabel>
        {property?.images && property.images.length > 0 ? (
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-4">
            {property.images.map(img => (
              <div key={img.id} className="relative aspect-square">
                <Image src={img.imageUrl} alt="Gambar galeri" fill className="object-cover rounded-md" />
                <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => onDeleteImage(img.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-500 mt-2">Tidak ada gambar galeri.</p>}
      </div>
      <FormField control={control} name="galleryImages" render={({ field }) => (
        <FormItem><FormLabel>Unggah Gambar Galeri Baru (Opsional)</FormLabel><FormControl><ImageUpload files={field.value || []} onFilesChange={field.onChange} maxFiles={10} /></FormControl><FormMessage /></FormItem>
      )} />
    </div>
  );
}