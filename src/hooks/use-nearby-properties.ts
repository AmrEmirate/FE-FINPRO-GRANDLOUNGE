// src/hooks/use-nearby-properties.ts

import { useEffect, useState } from 'react';
import type { Map } from 'leaflet';
import api from '@/lib/apiHelper';
import type { Property } from '@/lib/types';

export function useNearbyProperties(map: Map | null) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;

    // Minta lokasi pengguna
    navigator.geolocation.getCurrentPosition(
      // Success Callback
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        map.flyTo([latitude, longitude], 14);

        // Ambil properti terdekat
        try {
          const response = await api.get('/properties/nearby', {
            params: { lat: latitude, lon: longitude, radius: 20000 },
          });
          setProperties(response.data.data);
        } catch (err) {
          setError("Gagal memuat properti di sekitar Anda.");
        } finally {
          setIsLoading(false);
        }
      },
      // Error Callback
      () => {
        setError("Tidak dapat mengakses lokasi Anda. Mohon izinkan akses lokasi di browser Anda.");
        setIsLoading(false);
      }
    );
  }, [map]);

  return { userLocation, properties, isLoading, error };
}