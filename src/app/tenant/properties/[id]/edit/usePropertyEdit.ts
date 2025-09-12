// app/tenant/properties/[id]/edit/usePropertyEdit.ts
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import apiHelper from "@/lib/apiHelper";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormValues } from "./PropertyEditForm";

// Definisikan tipe data yang dibutuhkan
interface Amenity { id: string; name: string; }
interface PropertyImage { id: string; imageUrl: string; }
interface PropertyData {
  id: string; name: string; description: string; categoryId: string; cityId: string;
  zipCode: string; mainImage: string | null; amenities: Amenity[]; images: PropertyImage[];
}
interface Category { id: string; name: string; }
interface City { id: string; name: string; }

export function usePropertyEdit(propertyId: string, form: UseFormReturn<PropertyFormValues>, router: AppRouterInstance) {
  const { toast } = useToast();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [amenities, setAmenities] = useState<{ value: string; label: string }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, catRes, cityRes, amenityRes] = await Promise.all([
          apiHelper.get(`/properties/my-properties/${propertyId}`),
          apiHelper.get("/categories"),
          apiHelper.get("/cities"),
          apiHelper.get("/amenities"),
        ]);
        const propData = propRes.data.data;
        setProperty(propData);
        setCategories(catRes.data.data);
        setCities(cityRes.data.data);
        setAmenities(amenityRes.data.data.map((a: Amenity) => ({ value: a.id, label: a.name })));
        form.reset({
          name: propData.name, description: propData.description, categoryId: propData.categoryId,
          cityId: propData.cityId, zipCode: propData.zipCode,
          amenityIds: propData.amenities.map((a: Amenity) => a.id),
        });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Gagal memuat data properti." });
        router.push("/tenant/properties");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [propertyId, toast, form, router]);

  const handleDeleteImage = (imageId: string) => {
    setDeletedImageIds(prev => [...prev, imageId]);
    setProperty(prev => prev ? ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }) : null);
  };

  const onSubmit = async (values: PropertyFormValues) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });
    deletedImageIds.forEach(id => formData.append('deletedImageIds', id));

    try {
      await apiHelper.patch(`/properties/my-properties/${propertyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({ title: "Sukses!", description: "Properti berhasil diperbarui." });
      router.push("/tenant/properties");
      router.refresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Gagal", description: error.response?.data?.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  };

  return { property, categories, cities, amenities, deletedImageIds, isLoading, isFetching, onSubmit, handleDeleteImage };
}