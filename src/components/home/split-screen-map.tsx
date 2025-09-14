"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/apiHelper';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';

// --- Definisi Ikon ---
const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="16" fill="#2563EB" fill-opacity="0.3" style="animation: pulse 2s infinite; transform-origin: center;"/>
      <circle cx="32" cy="32" r="8" fill="#2563EB"/>
      <style>@keyframes pulse { 0% { transform: scale(0.8); } 70% { transform: scale(1.2); } 100% { transform: scale(0.8); } }</style>
    </svg>`),
    iconSize: [64, 64],
    iconAnchor: [32, 32],
});

const propertyIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L3 9v12h18V9L12 0zm-2 19H5v-7h5v7zm2-10.5L6.47 5h11.06L12 8.5zM19 19h-5v-7h5v7z" fill="#111827"/>
    </svg>`),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// --- Komponen Peta Internal ---
const MapView = () => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const map = useMap();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                map.flyTo([latitude, longitude], 14);

                try {
                    const response = await api.get('/properties/nearby', {
                        params: { lat: latitude, lon: longitude, radius: 20000 },
                    });
                    setNearbyProperties(response.data.data);
                } catch (err) {
                    console.error("Gagal mengambil properti terdekat:", err);
                } finally {
                    setIsLoading(false);
                }
            },
            () => {
                setIsLoading(false);
            }
        );
    }, [map]);

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 bg-white/70 z-[1000] flex flex-col items-center justify-center">
                    <Loader className="animate-spin text-gray-500 h-8 w-8" />
                </div>
            )}
            {userLocation && <Marker position={userLocation} icon={userIcon} />}
            {nearbyProperties.map((prop) => (
                <Marker
                    key={prop.id}
                    position={[Number(prop.latitude), Number(prop.longitude)]}
                    icon={propertyIcon}
                >
                    <Popup>
                        <div className="w-48">
                            <h3 className="font-bold text-base mb-1">{prop.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Mulai dari{' '}
                                <span className="font-semibold text-gray-800">
                                    {formatPrice(prop.rooms && prop.rooms.length > 0 ? prop.rooms[0].basePrice : 0)}/malam
                                </span>
                            </p>
                            <Button asChild size="sm" className="w-full">
                                <Link href={`/properties/${prop.id}`}>Lihat Detail</Link>
                            </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

// --- Komponen Utama dengan Tampilan Split-Screen ---
export default function SplitScreenMap() {
    const jakartaPosition: [number, number] = [-6.2088, 106.8456];

    return (
        <section className="h-[70vh] w-full flex flex-col lg:flex-row border-t border-b">
            {/* Kolom Kiri: Peta */}
            <div className="w-full lg:w-2/3 h-full">
                <MapContainer center={jakartaPosition} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <MapView />
                </MapContainer>
            </div>

            {/* Kolom Kanan: Penjelasan */}
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