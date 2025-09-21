"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/components/ui/use-toast"
import { OptionType } from "@/components/ui/multi-select"

// Tipe data didefinisikan di sini
interface Category { id: string; name: string }
interface City { id: string; name: string; latitude: number; longitude: number }
interface Amenity { id: string; name: string }

// Skema validasi Zod sebagai satu-satunya sumber kebenaran
export const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  address: z.string().min(10, "Full address is required and must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  cityId: z.string().min(1, "City is required"),
  zipCode: z.string().min(5, "Zip code must be 5 characters").max(5, "Zip code must be 5 characters"),
  amenityIds: z.array(z.string()).min(1, "Select at least one amenity"),
  mainImage: z.instanceof(File).refine(file => file.size > 0, "Main image is required."),
  galleryImages: z.array(z.instanceof(File)).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

// Fungsi untuk membuat FormData
const createPropertyFormData = (values: z.infer<typeof formSchema>) => {
  const formData = new FormData()
  
  // Meng-append semua data, termasuk gambar
  formData.append('name', values.name)
  formData.append('description', values.description)
  formData.append('address', values.address)
  formData.append('categoryId', values.categoryId)
  formData.append('cityId', values.cityId)
  formData.append('zipCode', values.zipCode)
  
  if (values.latitude) formData.append('latitude', values.latitude.toString())
  if (values.longitude) formData.append('longitude', values.longitude.toString())
  
  values.amenityIds?.forEach(id => formData.append('amenityIds', id))
  
  if (values.mainImage) formData.append('mainImage', values.mainImage)
  values.galleryImages?.forEach(file => formData.append('galleryImages', file))
  
  return formData
}

export function useNewPropertyForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [amenities, setAmenities] = useState<OptionType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  // Form diinisialisasi di dalam hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      categoryId: "",
      cityId: "",
      zipCode: "",
      amenityIds: [],
      galleryImages: [],
    },
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, cityRes, amenityRes] = await Promise.all([
          apiHelper.get("/categories"),
          apiHelper.get("/cities"),
          apiHelper.get("/amenities"),
        ])
        setCategories(catRes.data.data)
        setCities(cityRes.data.data)
        setAmenities(amenityRes.data.data.map((a: Amenity) => ({ value: a.id, label: a.name })))
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load initial data.",
        })
      } finally {
        setIsFetching(false)
      }
    }
    fetchInitialData()
  }, [toast])

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId)
    setSelectedCity(city || null)
    form.setValue("cityId", cityId)
  }
  
  // Fungsi onSubmit yang akan menangani data yang sudah divalidasi
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const formData = createPropertyFormData(values)
    try {
      await apiHelper.post('/properties/my-properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast({
        title: "Success!",
        description: "Your property has been created.",
      })
      router.push("/tenant/properties")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Something went wrong. Please check your input.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mengembalikan semua yang dibutuhkan oleh halaman
  return {
    form,
    categories,
    cities,
    amenities,
    isLoading,
    isFetching,
    selectedCity,
    onSubmit,
    handleCityChange,
  }
}