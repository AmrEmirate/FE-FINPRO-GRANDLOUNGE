import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';
import type { Room } from '@/lib/types';

interface Availability {
  date: string;
  isAvailable: boolean;
  price?: number;
}

interface PeakSeasonFromApi {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  adjustmentType: 'PERCENTAGE' | 'NOMINAL';
  adjustmentValue: number;
}

export interface PeakSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  adjustmentType: 'PERCENTAGE' | 'NOMINAL';
  adjustmentValue: number;
}

export const useRoomAvailability = (propertyId: string, roomId: string, month: Date) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!roomId || !propertyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [roomDetailsRes, availabilityRes, peakSeasonsRes] = await Promise.all([
        api.get(`/properties/my-properties/${propertyId}/rooms/${roomId}`),
        api.get(`/properties/my-properties/${propertyId}/rooms/${roomId}/availability-by-month`, {
          params: { month: month.getMonth() + 1, year: month.getFullYear() }
        }),
        api.get(`/peak-seasons/by-room/${roomId}`),
      ]);

      setRoom(roomDetailsRes.data.data || null);
      setAvailability(availabilityRes.data.data || []);
      
      const processedPeakSeasons = (peakSeasonsRes.data.data || []).map((season: PeakSeasonFromApi) => ({
        ...season,
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
      }));
      setPeakSeasons(processedPeakSeasons);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || (err instanceof Error ? err.message : 'An unexpected error occurred');
      setError(new Error(errorMessage));
      toast.error("Gagal memuat data ketersediaan", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, propertyId, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { room, availability, peakSeasons, isLoading, error, refetch };
};