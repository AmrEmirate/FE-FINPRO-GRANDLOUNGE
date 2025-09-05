"use client"

import { useState, useEffect, useCallback } from "react"
import api from "@/utils/api"
import { useToast } from "@/components/ui/use-toast"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface Availability {
  date: string;
  isAvailable: boolean;
  price?: number;
}

export function useRoomAvailability(propertyId: string, roomId: string) {
  const { toast } = useToast();
  const [roomName, setRoomName] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchAvailability = useCallback(async () => {
    if (!roomId || !propertyId) return;

    setIsLoading(true);

    try {
      const roomRes = await api.get(`/properties/my-properties/${propertyId}/rooms/${roomId}`);
      if (roomRes.data && roomRes.data.data) {
        setRoomName(roomRes.data.data.name);
        setBasePrice(roomRes.data.data.basePrice);
      }

      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      // --- PERBAIKAN URL API ---
      // Endpoint yang benar seharusnya ada di dalam room, bukan property
      const availabilityRes = await api.get(`/properties/my-properties/${propertyId}/rooms/${roomId}/availability-by-month?month=${month}&year=${year}`);
      
      if (availabilityRes.data && availabilityRes.data.data) {
        setAvailability(availabilityRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch room availability data:", error);
      toast({
        variant: "destructive",
        title: "Gagal Mengambil Data",
        description: "Tidak dapat memuat data ketersediaan kamar.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, propertyId, currentMonth, toast]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSave = async (
    dateRange: DateRange,
    isAvailable: boolean,
    price?: number
  ) => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        variant: "destructive",
        title: "Tanggal Tidak Valid",
        description: "Harap pilih tanggal mulai dan selesai.",
      });
      return;
    }

    // --- PERBAIKAN PAYLOAD ---
    const payload = {
      startDate: format(dateRange.from, "yyyy-MM-dd"),
      endDate: format(dateRange.to, "yyyy-MM-dd"),
      isAvailable,
      // Jika tidak tersedia, harga tidak perlu dikirim.
      // Jika tersedia, gunakan harga yang diberikan atau harga dasar.
      price: isAvailable ? (price !== undefined ? price : basePrice) : undefined,
    };

    try {
      // Endpoint untuk menyimpan data
      await api.post(`/properties/my-properties/${propertyId}/rooms/${roomId}/availability`, payload);
      
      toast({
        title: "Sukses",
        description: "Ketersediaan dan harga berhasil diperbarui.",
      });

      // Muat ulang data untuk me-refresh kalender
      fetchAvailability();
    } catch (error: any) {
      console.error("Failed to update availability:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: error.response?.data?.message || "Terjadi kesalahan saat menyimpan perubahan.",
      });
    }
  };

  return {
    roomName,
    basePrice,
    availability,
    isLoading,
    currentMonth,
    setCurrentMonth,
    handleSave,
    fetchAvailability, 
  };
}