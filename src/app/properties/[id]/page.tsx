// src/app/properties/[id]/page.tsx

"use client" // JADIKAN CLIENT COMPONENT KARENA ADA STATE

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PropertyImageGallery } from "@/components/property/property-image-gallery";
import { PropertyInfo } from "@/components/property/property-info";
import { RoomSelection } from "@/components/property/room-selection";
import { BookingSidebar } from "@/components/property/booking-sidebar";
import type { Property, Room } from "@/lib/types"; // Impor tipe

// Fungsi untuk mengambil data properti, sekarang di sisi client
async function getProperty(id: string): Promise<Property | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${id}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch property:", error);
        return null;
    }
}

// Komponen utama menjadi Client Component
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      const data = await getProperty(params.id);
      setProperty(data);
      if (data && data.rooms && data.rooms.length > 0) {
        setSelectedRoom(data.rooms[0]); // Set kamar pertama sebagai default
      }
      setIsLoading(false);
    };
    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading property details...</div>; // Tampilkan loading state
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Property Not Found</h1>
        <Link href="/properties"><Button>Back to Properties</Button></Link>
      </div>
    );
  }

  const galleryImages = [
    property.mainImage,
    ...(property.images?.map(img => img.imageUrl) || [])
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <PropertyImageGallery images={galleryImages} propertyName={property.name} />
            <PropertyInfo property={property} />
            <RoomSelection 
              rooms={property.rooms || []} 
              selectedRoomId={selectedRoom?.id || null} 
              onRoomSelect={setSelectedRoom} 
            />
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <BookingSidebar rooms={property.rooms || []} selectedRoom={selectedRoom} />
          </div>
        </div>
      </div>
    </div>
  );
}