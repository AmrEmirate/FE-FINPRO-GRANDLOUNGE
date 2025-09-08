import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';

// --- Tipe Data ---
interface Availability {
  date: string;
  isAvailable: boolean;
  price: number | null;
}

interface PeakSeasonFromApi {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  adjustmentType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  adjustmentValue: number;
}

export interface PeakSeason {
  id: string;
  name: string;
  startDate: Date; // Di UI kita gunakan tipe Date
  endDate: Date;   // Di UI kita gunakan tipe Date
  adjustmentType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  adjustmentValue: number;
}

export const useRoomAvailability = (roomId: string) => {
  const [roomName, setRoomName] = useState<string>('');
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!roomId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [availabilityRes, peakSeasonsRes, roomDetailsRes] = await Promise.all([
        api.get(`/tenant/rooms/${roomId}/availability`),
        api.get(`/tenant/rooms/${roomId}/peak-seasons`),
        api.get(`/tenant/rooms/${roomId}`),
      ]);

      setAvailability(availabilityRes.data.data || []);

      const processedPeakSeasons = (peakSeasonsRes.data.data || []).map((season: PeakSeasonFromApi) => ({
        ...season,
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
      }));
      setPeakSeasons(processedPeakSeasons);

      setRoomName(roomDetailsRes.data.data.name || '');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      toast.error("Gagal memuat data", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { roomName, availability, peakSeasons, isLoading, error, refetch };
};