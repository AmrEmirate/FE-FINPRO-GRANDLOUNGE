// src/app/properties/[id]/page.tsx (Setelah di-refactor)

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { PropertyImageGallery } from "@/components/property/property-image-gallery";
import { PropertyInfo } from "@/components/property/property-info";
import { RoomSelection } from "@/components/property/room-selection";
import { BookingSidebar } from "@/components/property/booking-sidebar";
import { PropertyAvailabilityCalendar } from "@/components/property/property-availability-calendar";
import PropertyReviews from "@/components/property/PropertyReviews";
import { usePropertyDetail } from "@/hooks/use-property-detail"; // <-- Impor hook baru

const PropertyMap = dynamic(
  () => import('@/components/property/property-map').then(mod => mod.PropertyMap),
  { ssr: false, loading: () => <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg" /> }
);

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Gunakan custom hook untuk semua logika
  const {
    property,
    isLoading,
    availableRooms,
    isCheckingAvailability,
    selectedRoom,
    selectedRange,
    setSelectedRoom,
    setSelectedRange,
  } = usePropertyDetail(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Property Not Found</h1>
        <Link href="/properties"><Button>Back to Properties</Button></Link>
      </div>
    );
  }
  
  const galleryImages = [property.mainImage, ...(property.images?.map(img => img.imageUrl) || [])].filter(Boolean) as string[];
  const latitude = property.city?.latitude ? parseFloat(String(property.city.latitude)) : null;
  const longitude = property.city?.longitude ? parseFloat(String(property.city.longitude)) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <PropertyImageGallery images={galleryImages} propertyName={property.name} />
            <PropertyInfo property={property} />

            {latitude && longitude && (
              <PropertyMap latitude={latitude} longitude={longitude} propertyName={property.name} />
            )}

            <PropertyAvailabilityCalendar
              propertyId={property.id}
              selectedRange={selectedRange}
              onSelectRange={setSelectedRange}
            />

            {isCheckingAvailability && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="ml-4">Mengecek ketersediaan kamar...</p>
              </div>
            )}

            {!isCheckingAvailability && (
              <RoomSelection
                rooms={availableRooms}
                selectedRoomId={selectedRoom?.id || null}
                onRoomSelect={setSelectedRoom}
              />
            )}
            
            {property.reviews && property.reviews.length > 0 && (
              <PropertyReviews reviews={property.reviews} />
            )}
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <BookingSidebar
              propertyId={property.id}
              selectedRoom={selectedRoom}
              selectedRange={selectedRange}
              onDateChange={setSelectedRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}