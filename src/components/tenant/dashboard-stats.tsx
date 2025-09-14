"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/apiHelper';
import { formatPrice } from '@/lib/utils/format';
import { TrendingUp, Briefcase, Percent, BedDouble } from 'lucide-react';

// Tipe data untuk statistik
interface Stats {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  totalRooms: number;
}

// Komponen Skeleton untuk tampilan loading
const StatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-3 w-1/3 mt-1" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// PASTIKAN FUNGSI INI TIDAK MEMILIKI '{ stats }' DI DALAM KURUNG
export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/report/stats'); // Pastikan alamat API ini benar
        setStats(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (!stats) {
    return <p className="col-span-4 text-center text-muted-foreground">Gagal memuat data statistik.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className='bg-gray-900 text-white'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
          <CardTitle className="text-sm font-medium text-white">Total Pendapatan</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-">{formatPrice(stats.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground text-white">Dari semua pemesanan</p>
        </CardContent>
      </Card>
      <Card className='bg-gray-900 text-white'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pemesanan</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground bg-gray-900 text-white " />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-muted-foreground text-white">Jumlah transaksi berhasil</p>
        </CardContent>
      </Card>
      <Card className='bg-gray-900 text-white'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tingkat Hunian</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground bg-gray-900 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground text-white">Bulan ini</p>
        </CardContent>
      </Card>
      <Card className='bg-gray-900 text-white'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kamar</CardTitle>
          <BedDouble className="h-4 w-4 text-muted-foreground bg-gray-900 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRooms}</div>
          <p className="text-xs text-muted-foreground text-white">Di semua properti aktif</p>
        </CardContent>
      </Card>
    </div>
  );
}