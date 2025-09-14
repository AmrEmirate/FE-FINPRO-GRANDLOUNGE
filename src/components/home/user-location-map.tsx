"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader } from 'lucide-react';

const StaticMapPlaceholder = ({ location }: { location: string | null }) => (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        {location ? (
            <div className="text-center text-gray-600">
                <MapPin className="w-12 h-12 mx-auto text-red-500" />
                <p className="mt-2 font-semibold">Lokasi Anda Ditemukan!</p>
                <p className="text-sm">{location}</p>
            </div>
        ) : (
            <p className="text-gray-500">Peta akan ditampilkan di sini...</p>
        )}
    </div>
);

export default function UserLocationMap() {
    const [location, setLocation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation tidak didukung oleh browser Anda.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
                setIsLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Anda menolak permintaan akses lokasi.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Informasi lokasi tidak tersedia.");
                        break;
                    case err.TIMEOUT:
                        setError("Permintaan untuk mendapatkan lokasi pengguna timed out.");
                        break;
                    default:
                        setError("Terjadi kesalahan yang tidak diketahui.");
                        break;
                }
                setIsLoading(false);
            }
        );
    };
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Temukan Properti di Sekitar Anda</CardTitle>
                <CardDescription>
                    Izinkan kami mengakses lokasi Anda untuk menampilkan properti terdekat.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <StaticMapPlaceholder location={location} />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button onClick={handleFindLocation} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <MapPin className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Mencari Lokasi...' : 'Tampilkan Lokasi Saya'}
                </Button>
            </CardContent>
        </Card>
    );
};