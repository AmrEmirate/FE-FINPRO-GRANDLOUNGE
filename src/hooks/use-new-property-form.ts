// src/hooks/use-new-property-form.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import apiHelper from "@/lib/apiHelper";
import * as z from "zod";

// Definisikan tipe di satu tempat agar bisa di-reuse
interface Category { id: string; name: string; }
interface City { id: string; name: string; latitude: number; longitude: number; }
interface Amenity { id: string; name: string; }
export interface OptionType { value: string; label: string; }

// Helper function untuk memisahkan logika API call
const fetchInitialData = async () => {
  const [catRes, cityRes, amenityRes] = await Promise.all([
    apiHelper.get("/categories"),
    apiHelper.get("/cities"),
    apiHelper.get("/amenities"),
  ]);
  return {
    categories: catRes.data.data as Category[],
    cities: cityRes.data.data as City[],
    amenities: amenityRes.data.data.map((a: Amenity) => ({ value: a.id, label: a.name })) as OptionType[],
  };
};

// Helper function untuk membuat FormData
const createPropertyFormData = (values: any): FormData => {
  const formData = new FormData();
  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('categoryId', values.categoryId);
  formData.append('cityId', values.cityId);
  formData.append('zipCode', values.zipCode);
  if (values.latitude) formData.append('latitude', values.latitude.toString());
  if (values.longitude) formData.append('longitude', values.longitude.toString());
  values.amenityIds.forEach((id: string) => formData.append('amenityIds', id));
  if (values.mainImage) {
    formData.append('mainImage', values.mainImage);
  }
  if (values.galleryImages) {
    values.galleryImages.forEach((file: File) => formData.append('galleryImages', file));
  }
  return formData;
};

export const useNewPropertyForm = (propertyFormSchema: z.ZodType<any, any>) => {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<{ categories: Category[]; cities: City[]; amenities: OptionType[] }>({ categories: [], cities: [], amenities: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitialData()
      .then(setData)
      .catch(() => {
        toast({ variant: "destructive", title: "Error", description: "Failed to load initial data." });
      });
  }, [toast]);

  const handleSubmit = async (values: z.infer<typeof propertyFormSchema>) => {
    setIsLoading(true);
    const formData = createPropertyFormData(values);
    try {
      await apiHelper.post("/properties", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast({ title: "Success!", description: "Your property has been created successfully." });
      router.push("/tenant/properties");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Something went wrong.";
      toast({ variant: "destructive", title: "Submission Failed", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...data,
    isLoading,
    handleSubmit,
  };
};