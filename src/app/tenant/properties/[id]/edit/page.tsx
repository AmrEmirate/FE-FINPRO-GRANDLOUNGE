// src/app/tenant/properties/[id]/edit/page.tsx

"use client"

import { useRouter } from "next/navigation"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Trash2 } from "lucide-react"
import { useEditProperty } from "@/hooks/use-edit-property"
import { PropertyFormBasic } from "@/components/tenant/property-form-basic"
// (Import komponen-komponen form lainnya jika Anda membuatnya)
import { LocationPicker } from "@/components/tenant/LocationPicker"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { ImageUpload } from "@/components/tenant/image-upload"
import Image from "next/image"


export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    form, property, categories, cities, amenities, isLoading, isFetching,
    selectedCity, onSubmit, handleDeleteImage, handleCityChange,
  } = useEditProperty(params.id)

  if (isFetching) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Property</CardTitle>
          <CardDescription>Update the details of your property.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <PropertyFormBasic categories={categories} cities={cities} onCityChange={handleCityChange} />
              
              {/* Bagian lain dari Form */}
              <FormItem>
                <FormLabel>Location</FormLabel>
                <LocationPicker 
                    onLocationSelect={({ lat, lng }) => { form.setValue("latitude", lat); form.setValue("longitude", lng) }}
                    initialPosition={form.getValues("latitude") && form.getValues("longitude") ? { lat: form.getValues("latitude")!, lng: form.getValues("longitude")! } : undefined}
                    cityCoordinates={selectedCity ? { lat: selectedCity.latitude, lng: selectedCity.longitude } : undefined}
                />
              </FormItem>

              <FormField control={form.control} name="amenityIds" render={({ field }) => (
                <FormItem><FormLabel>Amenities</FormLabel><FormControl><MultiSelect options={amenities} selected={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
              )} />
              
              {/* Manajemen Gambar (bisa juga dijadikan komponen sendiri) */}
              <div>
                <FormLabel>Current Images</FormLabel>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {property?.mainImage && <div className="relative aspect-square border-2 border-primary rounded-md p-1"><Image src={property.mainImage} alt="Main" fill className="object-cover rounded-sm" /><div className="absolute bottom-0 w-full text-center bg-black/50 text-white text-xs py-0.5">Main</div></div>}
                  {property?.images.map(img => (
                    <div key={img.id} className="relative aspect-square">
                      <Image src={img.imageUrl} alt="Gallery" fill className="object-cover rounded-md" />
                      <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleDeleteImage(img.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              <FormField control={form.control} name="mainImage" render={({ field }) => (
                <FormItem><FormLabel>Upload New Main Image</FormLabel><FormControl><ImageUpload files={field.value ? [field.value] : []} onFilesChange={(f) => field.onChange(f[0])} maxFiles={1} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="galleryImages" render={({ field }) => (
                <FormItem><FormLabel>Upload New Gallery Images</FormLabel><FormControl><ImageUpload files={field.value || []} onFilesChange={field.onChange} maxFiles={10} /></FormControl></FormItem>
              )} />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}