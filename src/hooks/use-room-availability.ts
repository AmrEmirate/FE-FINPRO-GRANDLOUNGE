// src/hooks/use-room-availability.ts

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';
import type { Room } from '@/lib/types'; // PERBAIKAN: Tambahkan impor tipe 'Room'

// --- Tipe Data ---
// Tipe ini mendefinisikan struktur data ketersediaan harian
interface Availability {
  date: string;
  isAvailable: boolean;
  price?: number; // Harga bisa opsional
}

// Tipe ini merepresentasikan data PeakSeason seperti yang diterima dari API (dengan tanggal sebagai string)
interface PeakSeasonFromApi {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  adjustmentType: 'PERCENTAGE' | 'NOMINAL'; 
  adjustmentValue: number;
}

// Tipe ini adalah data PeakSeason yang akan kita gunakan di frontend (dengan tanggal sebagai objek Date)
export interface PeakSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  adjustmentType: 'PERCENTAGE' | 'NOMINAL';
  adjustmentValue: number;
}

/**
 * Custom hook untuk mengambil data detail kamar, ketersediaan harian, dan peak seasons.
 * @param roomId - ID dari kamar yang ingin diambil datanya.
 * @returns Objek yang berisi data kamar, ketersediaan, status loading, error, dan fungsi refetch.
 */
export const useRoomAvailability = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!roomId) {
        setIsLoading(false);
        return;
    };

    setIsLoading(true);
    setError(null);
    try {
      // Mengambil semua data yang dibutuhkan secara paralel untuk efisiensi
      const [availabilityRes, peakSeasonsRes, roomDetailsRes] = await Promise.all([
        api.get(`/tenant/rooms/${roomId}/availability`), // Endpoint ketersediaan
        api.get(`/tenant/rooms/${roomId}/peak-seasons`), // Endpoint peak seasons
        api.get(`/tenant/rooms/${roomId}`), // Endpoint detail kamar
      ]);

      setAvailability(availabilityRes.data.data || []);

      // Memproses data peak season: mengubah string tanggal dari API menjadi objek Date
      const processedPeakSeasons = (peakSeasonsRes.data.data || []).map((season: PeakSeasonFromApi) => ({
        ...season,
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
      }));
      setPeakSeasons(processedPeakSeasons);

      // Menyimpan seluruh data detail kamar
      setRoom(roomDetailsRes.data.data || null);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || (err instanceof Error ? err.message : 'An unexpected error occurred');
      setError(new Error(errorMessage));
      toast.error("Gagal memuat data ketersediaan", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi untuk memuat ulang data secara manual jika diperlukan
  const refetch = () => fetchData();

  return { room, availability, peakSeasons, isLoading, error, refetch };
};