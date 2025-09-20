"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNewPropertyForm } from "@/hooks/use-new-property-form"; // Import hook
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { ImageUpload } from "@/components/tenant/image-upload"
import { LocationPicker } from "@/components/tenant/LocationPicker"
import { useRouter } from "next/navigation";

// Tipe data City untuk state lokal
interface City { 
  id: string; 
  name: string; 
  latitude: number; 
  longitude: number; 
}

// Skema validasi Zod
const propertyFormSchema = z.object({
  name: z.string().min(5, { message: "Property name must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  categoryId: z.string({ required_error: "Please select a category." }),
  cityId: z.string({ required_error: "Please select a city." }),
  zipCode: z.string().min(5, { message: "Zip code must be 5 characters." }).max(5, { message: "Zip code must be 5 characters." }),
  amenityIds: z.array(z.string()).min(1, { message: "Select at least one amenity." }),
  mainImage: z.instanceof(File, { message: "Main image is required." }),
  galleryImages: z.array(z.instanceof(File)).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export default function NewPropertyPage() {
  const router = useRouter();
  const { categories, cities, amenities, isLoading, handleSubmit } = useNewPropertyForm(propertyFormSchema);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: { 
      name: "", 
      description: "", 
      zipCode: "",
      amenityIds: [], 
      galleryImages: [] 
    },
  });

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    setSelectedCity(city || null);
    form.setValue("cityId", cityId, { shouldValidate: true });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add a New Property</CardTitle>
          <CardDescription>Fill in the details below to list a new property.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grand Hyatt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your property..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="cityId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={handleCityChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="zipCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormItem>
                <FormLabel>Location</FormLabel>
                <LocationPicker 
                  onLocationSelect={({ lat, lng }) => {
                    form.setValue("latitude", lat, { shouldValidate: true });
                    form.setValue("longitude", lng, { shouldValidate: true });
                  }}
                  cityCoordinates={selectedCity ? { lat: selectedCity.latitude, lng: selectedCity.longitude } : undefined}
                />
              </FormItem>

              <FormField control={form.control} name="amenityIds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <MultiSelect options={amenities} selected={field.value} onChange={field.onChange} placeholder="Select amenities..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="mainImage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Property Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      files={field.value ? [field.value] : []} 
                      onFilesChange={(files) => field.onChange(files[0])} 
                      maxFiles={1} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="galleryImages" render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Gallery Images</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      files={field.value || []} 
                      onFilesChange={field.onChange} 
                      maxFiles={10} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Saving..." : "Save Property"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}