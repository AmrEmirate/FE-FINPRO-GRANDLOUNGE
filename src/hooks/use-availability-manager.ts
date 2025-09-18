// src/hooks/use-availability-manager.ts
import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { useRoomAvailability } from "@/hooks/use-room-availability";
import { useToast } from "@/components/ui/use-toast";
import api from "@/utils/api";
import { DateRange } from "react-day-picker";
import { PeakSeasonPayload } from "@/components/tenant/PeakSeasonDialog";

// Fungsi helper untuk memisahkan logika API
const availabilityService = {
  saveAvailability: (propertyId: string, roomId: string, range: DateRange, isAvailable: boolean, price?: number) => {
    const payload = {
      startDate: format(range.from!, "yyyy-MM-dd"),
      endDate: format(range.to || range.from!, "yyyy-MM-dd"),
      isAvailable,
      price: isAvailable ? price : undefined,
    };
    return api.post(`/properties/my-properties/${propertyId}/rooms/${roomId}/availability`, payload);
  },
  savePeakSeason: (propertyId: string, season: PeakSeasonPayload) => {
    const payload = {
      ...season,
      startDate: format(season.startDate, 'yyyy-MM-dd'),
      endDate: format(season.endDate, 'yyyy-MM-dd'),
    };
    if (season.id) {
      return api.put(`/peak-seasons/${season.id}`, payload);
    }
    return api.post('/peak-seasons', payload);
  },
  deletePeakSeason: (id: string) => {
    return api.delete(`/peak-seasons/${id}`);
  }
};

export const useAvailabilityManager = (propertyId: string, roomId: string) => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const { room, availability, peakSeasons, isLoading, error, refetch } = useRoomAvailability(propertyId, roomId, currentMonth);

  const handleSaveAvailability = async (range: DateRange, isAvailable: boolean, price?: number) => {
    if (!range.from) {
      toast({ title: "Error", description: "Tanggal mulai harus dipilih.", variant: "destructive" });
      return;
    }
    try {
      await availabilityService.saveAvailability(propertyId, roomId, range, isAvailable, price);
      toast({ title: "Sukses", description: "Ketersediaan berhasil diperbarui." });
      refetch();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan.", variant: "destructive" });
    }
  };

  const handleSavePeakSeason = async (season: PeakSeasonPayload) => {
    try {
      await availabilityService.savePeakSeason(propertyId, season);
      toast({ title: "Success", description: "Peak season saved." });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal menyimpan.", variant: "destructive" });
    }
  };

  const handleDeletePeakSeason = async (id: string) => {
    if (!confirm('Anda yakin ingin menghapus peak season ini?')) return;
    
    try {
      await availabilityService.deletePeakSeason(id);
      toast({ title: 'Success', description: 'Peak season dihapus.' });
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus peak season.', variant: 'destructive' });
    }
  };

  return {
    room,
    availability,
    peakSeasons,
    isLoading,
    error,
    currentMonth,
    setCurrentMonth,
    handleSaveAvailability,
    handleSavePeakSeason,
    handleDeletePeakSeason,
    refetch,
  };
};