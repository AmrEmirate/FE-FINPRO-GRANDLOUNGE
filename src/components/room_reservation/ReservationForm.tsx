'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import api from '@/utils/api';

interface ReservationFormProps {
    roomId: string;
    pricePerNight: number;
}

export default function ReservationForm({ roomId, pricePerNight }: ReservationFormProps) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = end.getTime() - start.getTime();
        if (diff <= 0) return 0;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights();
    const total = nights * pricePerNight;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nights <= 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Tanggal check-out harus setelah tanggal check-in.' });
            return;
        }
        setIsLoading(true);

        try {
            await api.post('/room-reservation', {
                roomId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
            });

            toast({ title: 'Sukses', description: 'Reservasi berhasil dibuat! Silakan lanjutkan pembayaran.' });

            // Arahkan pengguna ke halaman daftar pesanan setelah berhasil
            router.push('/dashboard/akun_user/orders');

        } catch (error: any) {
            setIsLoading(false);
            const errorMessage = error.response?.data?.message || 'Kamar tidak tersedia atau terjadi kesalahan.';
            toast({ variant: 'destructive', title: 'Gagal Reservasi', description: errorMessage });
            console.error(error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Buat Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="checkIn">Tanggal Check-in</Label>
                        <Input id="checkIn" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="checkOut">Tanggal Check-out</Label>
                        <Input id="checkOut" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                    </div>
                    <div className="font-bold text-lg">
                        Total: Rp {total.toLocaleString('id-ID')} ({nights} malam)
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || nights <= 0}>
                        {isLoading ? 'Memproses...' : 'Pesan Sekarang'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}