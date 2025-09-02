'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import apiHelper from "@/utils/api";
import { useAuth } from '@/context/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

function ReservationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('manual');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PERBAIKAN DI SINI ---
  // Pastikan semua parameter diambil dari URL
  const propertyId = searchParams.get('propertyId');
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const nights = searchParams.get('nights');
  const totalCost = searchParams.get('totalCost');

  const handleCreateReservation = async () => {
    if (!propertyId || !roomId || !checkIn || !checkOut || !user) {
      toast({
        title: 'Error',
        description: 'Data reservasi tidak lengkap atau Anda belum login.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const roomName = searchParams.get('roomName');
      if (!roomName) {
        toast({ variant: "destructive", title: "Error", description: "Nama kamar tidak ditemukan." });
        setIsProcessing(false);
        return;
      }


      const payload = {
        propertyId: propertyId,
        roomName: roomName,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        paymentMethod: paymentMethod,
        userId: user.id,
        guestInfo: {
          name: user?.fullName,
          email: user?.email,
        },
      };
      console.log("Payload yang dikirim:", payload);
      const response = await apiHelper.post('/by-room-name', payload);

      if (paymentMethod === 'gateway' && response.data.data.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        toast({
          title: 'Reservasi Berhasil Dibuat',
          description: 'Silakan unggah bukti pembayaran Anda.',
        });
        router.push('/dashboard/akun_user/orders');
      }
    } catch (error: any) {
      console.error('Failed to create reservation:', error);
      toast({
        title: 'Gagal Membuat Reservasi',
        description: error.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan Anda.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  console.log("DATA USER SAAT INI:", user);

  // Periksa apakah semua parameter ada sebelum menampilkan konten utama
  console.log({ propertyId, roomId, checkIn, checkOut, user });
  if (!propertyId || !checkIn || !checkOut || !nights || !totalCost) {
    return (
      <div className="text-center container mx-auto py-12">
        <p className="text-red-500">Data reservasi tidak valid.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Konfirmasi Pesanan Anda</CardTitle>
          <CardDescription>
            Periksa kembali detail pesanan dan pilih metode pembayaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detail Pesanan */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Detail Tanggal Menginap</h3>
              <div className="p-4 border rounded-md mt-2 space-y-1">
                <p><strong>Check-in:</strong> {format(new Date(checkIn), 'dd MMMM yyyy', { locale: id })}</p>
                <p><strong>Check-out:</strong> {format(new Date(checkOut), 'dd MMMM yyyy', { locale: id })}</p>
                <p><strong>Durasi:</strong> {nights} malam</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Rincian Biaya</h3>
              <div className="p-4 border rounded-md mt-2">
                <div className="flex justify-between">
                  <span>Total Biaya</span>
                  <span className="font-bold">
                    Rp {parseInt(totalCost).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pilihan Metode Pembayaran */}
          <div>
            <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
            <RadioGroup
              defaultValue="manual"
              className="space-y-2"
              onValueChange={setPaymentMethod}
              value={paymentMethod}
            >
              <Label htmlFor="manual" className="flex items-center space-x-3 border p-4 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-600">
                <RadioGroupItem value="manual" id="manual" />
                <span>Transfer Bank Manual (Upload Bukti)</span>
              </Label>
              <Label htmlFor="gateway" className="flex items-center space-x-3 border p-4 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-600">
                <RadioGroupItem value="gateway" id="gateway" />
                <span>Payment Gateway (Kartu Kredit, Virtual Account, dll.)</span>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleCreateReservation}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function RoomReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>}>
      <ReservationContent />
    </Suspense>
  );
}
