// app/tenant/properties/[id]/edit/PropertyEditForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PropertyDetailsFields } from "./PropertyDetailsFields";
import { PropertyImageFields } from "./PropertyImageFields";
import { usePropertyEdit } from "./usePropertyEdit";

// Skema validasi form
const propertyFormSchema = z.object({
  name: z.string().min(5, "Nama properti minimal 5 karakter."),
  description: z.string().min(20, "Deskripsi minimal 20 karakter."),
  categoryId: z.string({ required_error: "Pilih kategori." }),
  cityId: z.string({ required_error: "Pilih kota." }),
  zipCode: z.string().min(5, "Kode pos harus 5 karakter.").max(5, "Kode pos harus 5 karakter."),
  amenityIds: z.array(z.string()).min(1, "Pilih minimal satu fasilitas."),
  mainImage: z.instanceof(File).optional(),
  galleryImages: z.array(z.instanceof(File)).optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function PropertyEditForm({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
  });

  const {
    property,
    categories,
    cities,
    amenities,
    deletedImageIds,
    isLoading,
    isFetching,
    onSubmit,
    handleDeleteImage,
  } = usePropertyEdit(propertyId, form, router);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PropertyDetailsFields
          control={form.control}
          categories={categories}
          cities={cities}
          amenities={amenities}
        />
        <PropertyImageFields
          control={form.control}
          property={property}
          onDeleteImage={handleDeleteImage}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}