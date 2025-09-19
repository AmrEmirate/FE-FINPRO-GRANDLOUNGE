// src/hooks/use-property-detail.ts

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import apiHelper from '@/lib/apiHelper';
import type { Property, Room } from '@/lib/types';

// Fungsi getProperty bisa dipindahkan ke file helper (misal: src/lib/api/properties.ts)
// Namun untuk sementara, kita letakkan di sini.
async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch property:", error);
    return null;
  }
}

export function usePropertyDetail(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  // Efek untuk mengambil data properti utama
  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      const data = await getProperty(propertyId);
      setProperty(data);
      if (data?.rooms) {
        setAvailableRooms(data.rooms);
        if (data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0]);
        }
      }
      setIsLoading(false);
    };
    fetchProperty();
  }, [propertyId]);

  // Efek untuk mengambil kamar yang tersedia berdasarkan rentang tanggal
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!selectedRange?.from || !selectedRange?.to || !property) return;
      
      setIsCheckingAvailability(true);
      setAvailableRooms([]);
      setSelectedRoom(null);
      
      try {
        const checkIn = format(selectedRange.from, "yyyy-MM-dd");
        const checkOut = format(selectedRange.to, "yyyy-MM-dd");
        const url = `/properties/${property.id}/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`;
        const response = await apiHelper.get(url);

        setAvailableRooms(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedRoom(response.data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch available rooms:", error);
        setAvailableRooms([]);
      } finally {
        setIsCheckingAvailability(false);
      }
    };
    fetchAvailableRooms();
  }, [selectedRange, property]);

  return {
    property,
    isLoading,
    availableRooms,
    isCheckingAvailability,
    selectedRoom,
    selectedRange,
    setSelectedRoom,
    setSelectedRange,
  };
}