"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader, Compass, Search } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Pastikan path import ini benar

// --- Ikon Kustom yang Elegan ---
const customUserIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .pulse { animation: pulse-animation 2s infinite; transform-origin: center; }
        @keyframes pulse-animation {
          0% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(0.8); opacity: 1; }
        }
      </style>
      <circle cx="32" cy="32" r="16" fill="#2563EB" fill-opacity="0.3" class="pulse"/>
      <circle cx="32" cy="32" r="8" fill="#2563EB"/>
    </svg>
  `),
    iconSize: [64, 64],
    iconAnchor: [32, 32],
    popupAnchor: [0, -32],
});

// Komponen untuk animasi 'fly to'
const AnimateToLocation = ({ location }: { location: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(location, 15, { animate: true, duration: 2.5 });
    }, [location, map]);
    return null;
};

// --- Komponen Peta yang Sebenarnya ---
const MapView = () => {
    const [location, setLocation] = useState<[number, number] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation([position.coords.latitude, position.coords.longitude]);
                    setIsLoading(false);
                },
                (err) => {
                    setError("Gagal mendapatkan lokasi. Pastikan izin akses telah diberikan.");
                    setIsLoading(false);
                }
            );
        } else {
            setError("Geolocation tidak didukung oleh browser Anda.");
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100"><Loader className="animate-spin text-gray-400" /><p className="mt-2 text-sm text-gray-500">Mencari lokasi...</p></div>;
    }

    if (error) {
        return <div className="h-full w-full flex flex-col items-center justify-center bg-red-50 text-red-500"><MapPin /><p className="mt-2 text-sm text-center">{error}</p></div>;
    }

    if (location) {
        return (
            <MapContainer center={location} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <Marker position={location} icon={customUserIcon}>
                    <Popup>Anda berada di sekitar sini.</Popup>
                </Marker>
                <AnimateToLocation location={location} />
            </MapContainer>
        );
    }
    return null;
}

// --- Komponen Utama dengan Tampilan Split-Screen ---
export default function SplitScreenMap() {
    return (
        <div className="h-screen w-screen flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/3 h-full">
                <MapView />
            </div>

            {/* Kolom Kiri: Penjelasan */}
            <div className="w-full lg:w-1/3 bg-white p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Temukan Property di Sekitar Anda
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Temukan Property tempat yang nyaman untuk kalian singgahi
                    </p>
                    <a href="/properties">
                        <Button size="lg" className="w-full group bg-gray-900 text-white hover:bg-gray-700">
                            <Search className="mr-2 h-5 w-5" />
                            Mulai Cari Properti
                        </Button>
                    </a>
                </div>
            </div>

        </div>
    );
}