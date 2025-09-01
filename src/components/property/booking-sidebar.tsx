// src/components/property/booking-sidebar.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { addDays, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Room } from '@/lib/types';

interface BookingSidebarProps {
  propertyId: string;
  rooms: Room[];
  pricePerNight: number;
}

export function BookingSidebar({
  propertyId,
  rooms,
}: BookingSidebarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  const nights = useMemo(() => {
    if (date?.from && date?.to) {
      const diff = differenceInDays(date.to, date.from);
      return diff > 0 ? diff : 0;
    }
    return 0;
  }, [date]);

  const totalCost = useMemo(() => {
    // === PERBAIKAN DI SINI ===
    // Tambahkan pengecekan ini untuk memastikan 'rooms' tidak undefined
    if (!rooms || rooms.length === 0) return 0;

    const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
    if (!selectedRoom) return 0;
    const roomPrice = selectedRoom.basePrice;
    return nights > 0 ? nights * roomPrice : 0;
  }, [nights, selectedRoomId, rooms]);

  const handleReserve = () => {
    if (!date?.from || !date?.to || !selectedRoomId || nights <= 0) {
      toast({
        title: 'Input tidak lengkap',
        description:
          'Silakan pilih tanggal check-in, check-out, dan jenis kamar.',
        variant: 'destructive',
      });
      return;
    }

    const queryParams = new URLSearchParams({
      propertyId,
      roomId: selectedRoomId,
      checkIn: date.from.toISOString(),
      checkOut: date.to.toISOString(),
      nights: nights.toString(),
      totalCost: totalCost.toString(),
    });

    router.push(`/room_reservation?${queryParams.toString()}`);
  };

  const selectedRoomPrice = useMemo(() => {
    // === PERBAIKAN DI SINI JUGA ===
    // Tambahkan pengecekan ini untuk keamanan
    if (!rooms || rooms.length === 0) return 0;

    const room = rooms.find((r) => r.id === selectedRoomId);
    return room ? room.basePrice : 0;
  }, [selectedRoomId, rooms]);

  if (!rooms || rooms.length === 0) {
    return (
      <aside className="sticky top-24 col-span-4 rounded-xl border p-6 shadow-lg">
        <h2 className="text-xl font-bold">Tidak ada kamar tersedia</h2>
        <p className="text-gray-500 mt-2">
          Tenant belum menambahkan kamar untuk properti ini.
        </p>
      </aside>
    );
  }

  return (
    <aside className="sticky top-24 col-span-4 rounded-xl border p-6 shadow-lg">
      <h2 className="text-2xl font-bold">
        Rp {selectedRoomPrice.toLocaleString('id-ID')}
        <span className="text-base font-normal"> / malam</span>
      </h2>
      <div className="mt-4">
        <div className="rounded-lg border">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="room-select" className="mb-2 block font-medium">
          Pilih Kamar
        </label>
        <Select onValueChange={setSelectedRoomId} value={selectedRoomId}>
          <SelectTrigger id="room-select">
            <SelectValue placeholder="Pilih jenis kamar" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name} - Rp {room.basePrice.toLocaleString('id-ID')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={handleReserve}
        disabled={nights <= 0 || !selectedRoomId}
      >
        Reserve
      </Button>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>
            Rp {selectedRoomPrice.toLocaleString('id-ID')} x {nights} malam
          </span>
          <span>Rp {totalCost.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Biaya layanan</span>
          <span>Rp 0</span>
        </div>
        <hr />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rp {totalCost.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </aside>
  );
}