'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import api from '@/utils/api'; // Gunakan satu instance API saja

function ReservationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  // Ambil juga 'loading' dari useAuth untuk menunggu data user siap
  const { user, loading } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('manual');
  const [isProcessing, setIsProcessing] = useState(false);

  // Ambil semua parameter dari URL
  const propertyId = searchParams.get('propertyId');
  const roomId = searchParams.get('roomId');
  const roomName = searchParams.get('roomName');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const nights = searchParams.get('nights');
  const totalPrice = searchParams.get('totalPrice');

  // Cek status login setelah loading selesai
  useEffect(() => {
    // Jika proses loading auth selesai dan ternyata user tidak ada (belum login)
    if (!loading && !user) {
      toast({
        title: 'Sesi Tidak Ditemukan',
        description: 'Anda harus login untuk melanjutkan reservasi.',
        variant: 'destructive',
      });
      // Arahkan ke halaman login
      router.push('/auth/login');
    }
  }, [user, loading, router, toast]);

  const handleCreateReservation = async () => {
    // Validasi yang lebih kuat, pastikan user sudah termuat
    if (loading || !user) {
      toast({
        title: 'Harap Tunggu',
        description: 'Sesi Anda sedang dimuat. Silakan coba lagi.',
      });
      return;
    }

    if (!propertyId || !roomId || !roomName || !checkIn || !checkOut || !totalPrice) {
      toast({
        title: 'Error',
        description: 'Data reservasi tidak lengkap. Coba ulangi dari halaman properti.',
        variant: 'destructive',
      });
      router.push('/properties');
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        propertyId,
        roomName,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        paymentMethod,
        guestInfo: {
          name: user.fullName,
          email: user.email,
        },
      };

      const response = await api.post('/reservations/by-room-name', payload);

      
        toast({
          title: 'Reservasi Berhasil Dibuat',
          description: 'Silakan unggah bukti pembayaran Anda di halaman pesanan.',
        });
        router.push('/dashboard/akun_user/orders');
      
    } catch (error: any) {
      toast({
        title: 'Gagal Membuat Reservasi',
        description: error.response?.data?.message || 'Terjadi kesalahan.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Tampilkan loading jika data user belum siap atau parameter URL tidak ada
  if (loading || !propertyId || !checkIn || !checkOut || !nights || !totalPrice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4">Memuat detail reservasi...</p>
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
                    Rp {parseInt(totalPrice).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
            <RadioGroup defaultValue="manual" className="space-y-2" onValueChange={setPaymentMethod} value={paymentMethod}>
              <Label htmlFor="manual" className="flex items-center space-x-3 border p-4 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-600">
                <RadioGroupItem value="manual" id="manual" />
                <span>Transfer Bank Manual (Upload Bukti)</span>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleCreateReservation} disabled={isProcessing || loading || !user}>
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