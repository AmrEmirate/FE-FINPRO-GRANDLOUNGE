"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { PropertyBasicInfo } from "@/components/tenant/property-basic-info"
import { PropertyLocationInfo } from "@/components/tenant/property-location-info"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"

// Definisikan tipe data yang kita butuhkan
interface Category {
  id: string;
  name: string;
}

interface City {
  id:string;
  name: string;
}

interface EditFormData {
  name: string;
  categoryId: string;
  description: string;
  cityId: string;
  zipCode: string;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const propertyId = params.id as string; // Ambil ID properti dari URL

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // State untuk loading data awal
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    categoryId: "",
    description: "",
    cityId: "",
    zipCode: "",
  });

  // Ambil data properti yang akan diedit dan juga data pendukung (kategori, kota)
  useEffect(() => {
    if (!propertyId) return;

    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [propRes, catRes, cityRes] = await Promise.all([
          apiHelper.get(`/properties/my-properties/${propertyId}`),
          apiHelper.get('/categories'),
          apiHelper.get('/cities'),
        ]);

        const propertyData = propRes.data.data;
        setFormData({
            name: propertyData.name,
            categoryId: propertyData.categoryId,
            description: propertyData.description,
            cityId: propertyData.cityId,
            zipCode: propertyData.zipCode,
        });

        setCategories(catRes.data.data);
        setCities(cityRes.data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Gagal Memuat Data Properti",
          description: "Properti tidak ditemukan atau terjadi kesalahan.",
        });
        router.push("/tenant/properties");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [propertyId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiHelper.patch(`/properties/my-properties/${propertyId}`, formData);
      toast({
        title: "Sukses!",
        description: "Properti berhasil diperbarui.",
      });
      router.push("/tenant/properties");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Properti",
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (updates: Partial<EditFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };
  
  // Tampilkan loading skeleton jika data sedang diambil
  if (isFetching) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/tenant/properties" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-1">Update your property details below.</p>
        </div>

        <form onSubmit={handleSubmit}>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update property name, category, and description.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PropertyBasicInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        categories={categories}
                    />
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                    <CardDescription>Update address and location information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PropertyLocationInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        cities={cities}
                    />
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
            </div>
        </form>
      </div>
    </div>
  )
}