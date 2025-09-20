import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PropertyImageGallery } from "@/components/property/property-image-gallery";
import { PropertyInfo } from "@/components/property/property-info";
import PropertyReviews from "@/components/property/PropertyReviews";
import { getPropertyById } from "@/services/propertyService";
import { PropertyClientComponent } from "@/components/property/PropertyClientComponent";
import { notFound } from "next/navigation";


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

   if (!property) {
    notFound(); 
  }

  const galleryImages = [
    property.mainImage,
    ...(property.images?.map((img: { imageUrl: any; }) => img.imageUrl) || [])
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        <div className="space-y-8">
          <PropertyImageGallery images={galleryImages} propertyName={property.name} />
          <PropertyInfo property={property} />
        </div>

        {/* 3. Render komponen interaktif, berikan data awal sebagai props */}
        <PropertyClientComponent property={property} />

        {/* Render review juga di server */}
        {property.reviews && property.reviews.length > 0 && (
          <div className="mt-8">
            <PropertyReviews reviews={property.reviews} />
          </div>
        )}
      </div>
    </div>
  )
}