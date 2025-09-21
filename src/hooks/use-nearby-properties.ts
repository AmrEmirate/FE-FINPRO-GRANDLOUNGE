"use client";

import { useState, useEffect, useCallback } from 'react';
import { Map } from 'leaflet';
import apiHelper from '@/lib/apiHelper';
import type { Property } from '@/lib/types';

interface UseNearbyPropertiesProps {
  map: Map;
}

export function useNearbyProperties({ map }: UseNearbyPropertiesProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyProperties = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiHelper.get(`/properties/nearby?lat=${lat}&lon=${lon}`);
      setProperties(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal memuat properti terdekat.';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      const center = map.getCenter();
      fetchNearbyProperties(center.lat, center.lng);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        map.flyTo([latitude, longitude], 14);
      },
      (geoError) => {
        console.warn("Tidak dapat mengakses lokasi pengguna:", geoError.message);
        const center = map.getCenter();
        fetchNearbyProperties(center.lat, center.lng);
      },
      { enableHighAccuracy: true }
    );

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, fetchNearbyProperties]);

  return { userLocation, properties, isLoading, error };
}