"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { MultiSelect, OptionType } from "@/components/ui/multi-select"
import { ImageUpload } from "@/components/tenant/image-upload"
import Image from "next/image"

interface Amenity { id: string; name: string; }
interface PropertyImage { id: string; imageUrl: string; }
interface PropertyData {
  id: string; name: string; description: string;
  categoryId: string; cityId: string; zipCode: string;
  mainImage: string | null; amenities: Amenity[]; images: PropertyImage[];
}
interface Category { id: string; name: string; }
interface City { id: string; name: string; }

const propertyFormSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(20),
  categoryId: z.string(),
  cityId: z.string(),
  zipCode: z.string().min(5).max(5),
  amenityIds: z.array(z.string()).min(1),
  mainImage: z.instanceof(File).optional(),
  galleryImages: z.array(z.instanceof(File)).optional(),
})

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [amenities, setAmenities] = useState<OptionType[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, catRes, cityRes, amenityRes] = await Promise.all([
          apiHelper.get(`/properties/my-properties/${params.id}`),
          apiHelper.get("/categories"),
          apiHelper.get("/cities"),
          apiHelper.get("/amenities"),
        ]);
        
        const propData = propRes.data.data;
        setProperty(propData)
        setCategories(catRes.data.data);
        setCities(cityRes.data.data);
        setAmenities(amenityRes.data.data.map((a: Amenity) => ({ value: a.id, label: a.name })));

        form.reset({
          name: propData.name,
          description: propData.description,
          categoryId: propData.categoryId,
          cityId: propData.cityId,
          zipCode: propData.zipCode,
          amenityIds: propData.amenities.map((a: Amenity) => a.id),
        });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load property data." });
      } finally {
        setIsFetching(false)
      }
    };
    fetchData();
  }, [params.id, toast, form]);

  const handleDeleteImage = (imageId: string) => {
    setDeletedImageIds(prev => [...prev, imageId]);
    setProperty(prev => prev ? ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }) : null);
  }

  async function onSubmit(values: z.infer<typeof propertyFormSchema>) {
    setIsLoading(true)
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('categoryId', values.categoryId);
    formData.append('cityId', values.cityId);
    formData.append('zipCode', values.zipCode);
    
    values.amenityIds.forEach(id => formData.append('amenityIds', id));
    deletedImageIds.forEach(id => formData.append('deletedImageIds', id));
    
    if (values.mainImage) formData.append('mainImage', values.mainImage);
    if (values.galleryImages) values.galleryImages.forEach(file => formData.append('galleryImages', file));

    try {
      await apiHelper.patch(`/properties/my-properties/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({ title: "Success!", description: "Property has been updated successfully." })
      router.push("/tenant/properties")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader><CardTitle>Edit Property</CardTitle><CardDescription>Update the details of your property below.</CardDescription></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Property Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem> )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="categoryId" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="cityId" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger></FormControl><SelectContent>{cities.map(city => (<SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
              </div>
              <FormField control={form.control} name="zipCode" render={({ field }) => ( <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="amenityIds" render={({ field }) => ( <FormItem><FormLabel>Amenities</FormLabel><FormControl><MultiSelect options={amenities} selected={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
              <div><FormLabel>Current Main Image</FormLabel>{property?.mainImage ? ( <div className="mt-2 relative w-48 h-48"><Image src={property.mainImage} alt="Main property image" fill className="object-cover rounded-md" /></div> ) : <p className="text-sm text-gray-500 mt-2">No main image.</p>}</div>
              <FormField control={form.control} name="mainImage" render={({ field }) => ( <FormItem><FormLabel>Upload New Main Image (optional)</FormLabel><FormControl><ImageUpload files={field.value ? [field.value] : []} onFilesChange={(files) => field.onChange(files[0])} maxFiles={1} /></FormControl><FormMessage /></FormItem> )} />
              <div><FormLabel>Current Gallery Images</FormLabel>{property?.images && property.images.length > 0 ? ( <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">{property.images.map(image => ( <div key={image.id} className="relative aspect-square"><Image src={image.imageUrl} alt="Gallery image" fill className="object-cover rounded-md" /><Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleDeleteImage(image.id)}><Trash2 className="h-4 w-4" /></Button></div> ))}</div> ) : <p className="text-sm text-gray-500 mt-2">No gallery images.</p>}</div>
              <FormField control={form.control} name="galleryImages" render={({ field }) => ( <FormItem><FormLabel>Upload New Gallery Images (optional)</FormLabel><FormControl><ImageUpload files={field.value || []} onFilesChange={field.onChange} maxFiles={10} /></FormControl><FormMessage /></FormItem> )} />
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}