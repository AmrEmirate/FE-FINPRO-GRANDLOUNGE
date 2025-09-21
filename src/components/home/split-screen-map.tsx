"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';
import { useNearbyProperties } from '@/hooks/use-nearby-properties';
import { userIcon, propertyIcon } from '@/lib/map-icons';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const PropertyPopup = ({ property }: { property: Property }) => (
  <div className="w-48">
    <h3 className="font-bold text-base mb-1">{property.name}</h3>
    <p className="text-sm text-gray-600 mb-2">
      Mulai dari{' '}
      <span className="font-semibold text-gray-800">
        {formatPrice(property.rooms?.[0]?.basePrice ?? 0)}/malam
      </span>
    </p>
    <Button asChild size="sm" className="w-full">
      <Link href={`/properties/${property.id}`}>Lihat Detail</Link>
    </Button>
  </div>
);

const MapView = () => {
  const map = useMap();
  const { toast } = useToast();
  
  // --- PERBAIKAN DI BARIS INI ---
  const { userLocation, properties, isLoading, error } = useNearbyProperties({ map });

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 z-[1000] flex items-center justify-center">
          <Loader className="animate-spin text-gray-500 h-8 w-8" />
        </div>
      )}
      {userLocation && <Marker position={userLocation} icon={userIcon} />}
      {properties
        .filter(
          (prop): prop is Property & { latitude: number; longitude: number } =>
            prop.latitude != null && prop.longitude != null
        )
        .map((prop) => (
          <Marker
            key={prop.id}
            position={[prop.latitude, prop.longitude]}
            icon={propertyIcon}
          >
            <Popup>
              <PropertyPopup property={prop} />
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default function SplitScreenMap() {
  const jakartaPosition: [number, number] = [-6.2088, 106.8456];

  return (
    <section className="h-[70vh] w-full flex flex-col lg:flex-row border-t border-b">
      <div className="w-full lg:w-2/3 h-full">
        <MapContainer center={jakartaPosition} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapView />
        </MapContainer>
      </div>
      <div className="w-full lg:w-1/3 bg-gray-50 p-8 flex flex-col justify-center items-center text-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Temukan Properti di Sekitar Anda
          </h2>
          <p className="text-muted-foreground mb-8">
            Jelajahi peta untuk melihat properti yang tersedia di dekat lokasi Anda secara instan.
          </p>
          <Button asChild size="lg" className="w-full group">
            <Link href="/properties">
              <Search className="mr-2 h-5 w-5" />
              Mulai Cari Semua Properti
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}