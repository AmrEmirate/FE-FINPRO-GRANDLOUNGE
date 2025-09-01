// src/app/room_reservation/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import apiHelper from "@/utils/api"

function ReservationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const propertyId = searchParams.get('propertyId');
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const nights = searchParams.get('nights');
  const totalCost = searchParams.get('totalCost');

  const handleCreateReservation = async () => {
    if (!propertyId || !roomId || !checkIn || !checkOut) {
      toast({
        title: 'Error',
        description: 'Data reservasi tidak lengkap.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await apiHelper.post('/room-reservations', {
        roomId,
        checkinDate: checkIn,
        checkoutDate: checkOut,
      });

      // Redirect ke halaman pembayaran Midtrans
      if (response.data.paymentTokenUrl) {
        window.location.href = response.data.paymentTokenUrl;
      } else {
        // Jika tidak ada URL payment gateway, redirect ke daftar pesanan
        toast({
          title: 'Reservasi Berhasil Dibuat',
          description:
            'Silakan unggah bukti pembayaran di halaman daftar pesanan.',
        });
        router.push('/dashboard/akun_user/orders');
      }
    } catch (error: any) {
      console.error('Failed to create reservation:', error);
      toast({
        title: 'Gagal Membuat Reservasi',
        description:
          error.response?.data?.message ||
          'Terjadi kesalahan saat memproses pesanan Anda.',
        variant: 'destructive',
      });
    }
  };

  if (!propertyId || !checkIn || !checkOut || !nights || !totalCost) {
    return (
      <div className="text-center">
        <p>Data reservasi tidak valid.</p>
        <Button onClick={() => router.push('/')}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Konfirmasi Pesanan Anda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Detail Penginapan</h3>
              {/* Di sini Anda bisa fetch dan tampilkan nama properti jika perlu */}
              <p>Properti ID: {propertyId}</p>
            </div>
            <div>
              <h3 className="font-semibold">Tanggal Menginap</h3>
              <p>
                Check-in:{' '}
                {format(new Date(checkIn), 'dd MMMM yyyy', { locale: id })}
              </p>
              <p>
                Check-out:{' '}
                {format(new Date(checkOut), 'dd MMMM yyyy', { locale: id })}
              </p>
              <p>Durasi: {nights} malam</p>
            </div>
            <div>
              <h3 className="font-semibold">Rincian Biaya</h3>
              <div className="flex justify-between">
                <span>Total Biaya</span>
                <span className="font-bold">
                  Rp {parseInt(totalCost).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCreateReservation}
            >
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RoomReservationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationContent />
    </Suspense>
  );
}