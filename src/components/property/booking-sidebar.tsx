'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Room } from '@/lib/types';

interface BookingSidebarProps {
  selectedRoom: Room | null;
  selectedRange: DateRange | undefined;
}

export function BookingSidebar({
  selectedRoom,
  selectedRange,
}: BookingSidebarProps) {
  const router = useRouter();
  const { toast } = useToast();

  const nights = useMemo(() => {
    if (selectedRange?.from && selectedRange?.to) {
      const diff = differenceInDays(selectedRange.to, selectedRange.from);
      return diff > 0 ? diff : 0;
    }
    return 0;
  }, [selectedRange]);

  const totalCost = useMemo(() => {
    if (!selectedRoom || nights <= 0) return 0;
    return nights * selectedRoom.basePrice;
  }, [nights, selectedRoom]);

  const handleReserve = () => {
    if (!selectedRange?.from || !selectedRange?.to || !selectedRoom || nights <= 0) {
      toast({
        title: 'Input tidak lengkap',
        description:
          'Silakan pilih tanggal check-in, check-out, dan jenis kamar.',
        variant: 'destructive',
      });
      return;
    }

    // --- PERBAIKAN DI SINI ---
    // Pastikan semua parameter yang dibutuhkan dikirim dengan benar ke URL
    const queryParams = new URLSearchParams({
      propertyId: selectedRoom.propertyId,
      roomId: selectedRoom.id,
      checkIn: selectedRange.from.toISOString(),
      checkOut: selectedRange.to.toISOString(),
      nights: nights.toString(),
      totalCost: totalCost.toString(),
    });

    router.push(`/room_reservation?${queryParams.toString()}`);
  };

  // Jika tidak ada kamar atau tanggal yang dipilih, tampilkan pesan
  if (!selectedRoom || !selectedRange?.from) {
    return (
      <aside className="sticky top-24 col-span-4 rounded-xl border p-6 shadow-lg">
        <h2 className="text-xl font-bold">Pilih Kamar & Tanggal</h2>
        <p className="text-gray-500 mt-2">
          Silakan pilih kamar dan tentukan tanggal menginap Anda untuk melihat rincian harga.
        </p>
      </aside>
    );
  }


  return (
    <aside className="sticky top-24 col-span-4 rounded-xl border p-6 shadow-lg">
      <h2 className="text-2xl font-bold">
        Rp {selectedRoom.basePrice.toLocaleString('id-ID')}
        <span className="text-base font-normal"> / malam</span>
      </h2>
      <p className="text-sm text-gray-500 mt-1">Untuk: {selectedRoom.name}</p>

      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Check-in</span>
          <span className="font-medium">{selectedRange.from ? selectedRange.from.toLocaleDateString('id-ID') : '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Check-out</span>
          <span className="font-medium">{selectedRange.to ? selectedRange.to.toLocaleDateString('id-ID') : '-'}</span>
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={handleReserve}
        disabled={nights <= 0 || !selectedRoom}
      >
        Reserve
      </Button>

      {nights > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>
              Rp {selectedRoom.basePrice.toLocaleString('id-ID')} x {nights} malam
            </span>
            <span>Rp {totalCost.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya layanan</span>
            <span>Rp 0</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {totalCost.toLocaleString('id-ID')}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
