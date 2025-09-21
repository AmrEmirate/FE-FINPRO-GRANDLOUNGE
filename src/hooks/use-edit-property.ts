"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/components/ui/use-toast"
import { OptionType } from "@/components/ui/multi-select"

interface Amenity { id: string; name: string }
interface PropertyImage { id: string; imageUrl: string }
export interface PropertyData { 
  id: string; 
  name: string; 
  description: string; 
  address: string | null; // Penyesuaian Tipe
  categoryId: string; 
  cityId: string; 
  zipCode: string; 
  mainImage: string | null; 
  amenities: Amenity[]; 
  images: PropertyImage[]; 
  latitude?: number; 
  longitude?: number 
}
export interface Category { id: string; name: string }
export interface City { id: string; name: string; latitude: number; longitude: number }

export const propertyFormSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  address: z.string().min(10, "Full address is required and must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  cityId: z.string().min(1, "City is required"),
  zipCode: z.string().min(5, "Zip code must be 5 characters").max(5, "Zip code must be 5 characters"),
  amenityIds: z.array(z.string()).min(1, "Select at least one amenity"),
  mainImage: z.instanceof(File).optional(),
  galleryImages: z.array(z.instanceof(File)).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

const createPropertyFormData = (values: z.infer<typeof propertyFormSchema>, deletedImageIds: string[]) => {
  const formData = new FormData()
  
  formData.append('name', values.name)
  formData.append('description', values.description)
  formData.append('address', values.address)
  formData.append('categoryId', values.categoryId)
  formData.append('cityId', values.cityId)
  formData.append('zipCode', values.zipCode)
  
  if (values.latitude) formData.append('latitude', values.latitude.toString())
  if (values.longitude) formData.append('longitude', values.longitude.toString())
  
  values.amenityIds?.forEach(id => formData.append('amenityIds', id))
  deletedImageIds?.forEach(id => formData.append('deletedImageIds', id))
  
  if (values.mainImage) formData.append('mainImage', values.mainImage)
  values.galleryImages?.forEach(file => formData.append('galleryImages', file))
  
  return formData
}

export function useEditProperty(propertyId: string) {
  const router = useRouter()
  const { toast } = useToast()
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [amenities, setAmenities] = useState<OptionType[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const form = useForm<z.infer<typeof propertyFormSchema>>({ 
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
        name: "",
        description: "",
        address: "",
        categoryId: "",
        cityId: "",
        zipCode: "",
        amenityIds: []
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, catRes, cityRes, amenityRes] = await Promise.all([
          apiHelper.get(`/properties/my-properties/${propertyId}`),
          apiHelper.get("/categories"), 
          apiHelper.get("/cities"), 
          apiHelper.get("/amenities"),
        ])
        
        const propData: PropertyData = propRes.data.data
        const fetchedCities: City[] = cityRes.data.data
        
        setProperty(propData)
        setCategories(catRes.data.data)
        setCities(fetchedCities)
        setAmenities(amenityRes.data.data.map((a: Amenity) => ({ value: a.id, label: a.name })))
        
        const cityOfProperty = fetchedCities.find(c => c.id === propData.cityId)
        setSelectedCity(cityOfProperty || null)
        
        form.reset({
          name: propData.name, 
          description: propData.description, 
          address: propData.address || '', // Penyesuaian Form
          categoryId: propData.categoryId,
          cityId: propData.cityId, 
          zipCode: propData.zipCode,
          amenityIds: propData.amenities.map((a: Amenity) => a.id),
          latitude: propData.latitude, 
          longitude: propData.longitude,
        })
      } catch {
        toast({ variant: "destructive", title: "Error", description: "Failed to load property data." })
        router.push("/tenant/properties")
      } finally {
        setIsFetching(false)
      }
    }
    fetchData()
  }, [propertyId, toast, form, router])
  
  const handleDeleteImage = (imageId: string) => {
    setDeletedImageIds(prev => [...prev, imageId])
    setProperty(prev => prev ? ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }) : null)
  }

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId)
    setSelectedCity(city || null)
    form.setValue("cityId", cityId)
  }
  
  const onSubmit = async (values: z.infer<typeof propertyFormSchema>) => {
    setIsLoading(true)
    const formData = createPropertyFormData(values, deletedImageIds)
    try {
      await apiHelper.patch(`/properties/my-properties/${propertyId}`, formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      })
      toast({ title: "Success!", description: "Property updated successfully." })
      router.push("/tenant/properties")
      router.refresh()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form, property, categories, cities, amenities, isLoading, isFetching,
    selectedCity, onSubmit, handleDeleteImage, handleCityChange,
  }
}