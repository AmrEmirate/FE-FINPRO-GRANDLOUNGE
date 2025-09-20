import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Property } from '@/lib/types';
import type { Map as LeafletMap } from 'leaflet'; // Import tipe Map dari leaflet

interface UseNearbyPropertiesProps {
  map: LeafletMap | null;
}

export const useNearbyProperties = ({ map }: UseNearbyPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    // --- PERBAIKAN DI SINI ---
    // Jika map belum siap (masih null), jangan jalankan kode di bawahnya.
    // useEffect akan otomatis berjalan lagi ketika map sudah siap.
    if (!map) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Pengecekan ulang untuk keamanan, meskipun seharusnya map sudah ada di sini.
          if (!map) return;

          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          map.flyTo([latitude, longitude], 14);

          // Ambil properti terdekat
          try {
            const response = await api.get('/properties/nearby', {
              params: { latitude, longitude },
            });
            setProperties(response.data);
          } catch (err: any) {
            setError(
              err.response?.data?.message ||
                'Gagal mengambil properti terdekat.',
            );
          } finally {
            setIsLoading(false);
          }
        },
        (geoError) => {
          setError('Tidak dapat mengakses lokasi Anda. Menampilkan lokasi default.');
          setIsLoading(false);
          // Set default view ke Jakarta jika lokasi ditolak
          // map di sini sudah pasti ada karena pengecekan di awal useEffect
          map.setView([-6.2088, 106.8456], 12);
        },
      );
    } else {
      setError('Geolocation tidak didukung oleh browser ini.');
      setIsLoading(false);
       // Set default view ke Jakarta jika geolocation tidak didukung
       map.setView([-6.2088, 106.8456], 12);
    }
  }, [map]); // Dependency array tetap `map`

  return { properties, isLoading, error, userLocation };
};