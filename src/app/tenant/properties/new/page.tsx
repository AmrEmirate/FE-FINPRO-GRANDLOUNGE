"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PropertyBasicInfo } from "@/components/tenant/property-basic-info"
import { PropertyLocationInfo } from "@/components/tenant/property-location-info"
import { PropertyImageUpload } from "@/components/tenant/property-image-upload"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"

// Definisikan tipe data untuk City dan Category
interface Category {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

// Tipe data untuk keseluruhan form
interface FullFormData {
  name: string;
  categoryId: string;
  description: string;
  cityId: string;
  zipCode: string;
  mainImage: File | null;
}

export default function NewPropertyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [formData, setFormData] = useState<FullFormData>({
    name: "",
    categoryId: "",
    description: "",
    cityId: "",
    zipCode: "",
    mainImage: null,
  })

  // Ambil data categories dan cities saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          apiHelper.get('/categories'),
          apiHelper.get('/cities')
        ]);
        setCategories(catRes.data.data);
        setCities(cityRes.data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Gagal memuat data",
          description: "Tidak bisa mengambil data kategori atau kota.",
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleNext = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const propertyPayload = {
        name: formData.name,
        categoryId: formData.categoryId,
        description: formData.description,
        cityId: formData.cityId,
        zipCode: formData.zipCode,
      };

      const response = await apiHelper.post('/properties', propertyPayload);
      const propertyId = response.data.data.id;

      toast({ title: "Sukses", description: "Info dasar properti berhasil disimpan." });

      if (formData.mainImage) {
        const imageFormData = new FormData();
        imageFormData.append('propertyImage', formData.mainImage);
        await apiHelper.patch(`/properties/${propertyId}/upload-image`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: "Sukses", description: "Gambar utama berhasil diunggah." });
      }

      router.push("/tenant/properties");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal membuat properti",
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (updates: Partial<FullFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const steps = [
    { number: 1, title: "Basic Information", description: "Property name, category, and description" },
    { number: 2, title: "Location Details", description: "Address and location information" },
    { number: 3, title: "Image", description: "Upload property main photo" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/tenant/properties" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-1">Create a new property listing for your accommodation.</p>
        </div>

        {/* ... (kode untuk Progress Steps tidak berubah) ... */}

        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <PropertyBasicInfo
                formData={formData}
                updateFormData={updateFormData}
                categories={categories}
              />
            )}
            {currentStep === 2 && (
              <PropertyLocationInfo
                formData={formData}
                updateFormData={updateFormData}
                cities={cities}
              />
            )}
            {currentStep === 3 && (
              <PropertyImageUpload
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Creating Property..." : "Create Property"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}