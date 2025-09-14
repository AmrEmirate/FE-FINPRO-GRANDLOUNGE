"use client";

// Hapus semua import yang tidak perlu seperti useState atau tipe data lama
import { DashboardStats } from '@/components/tenant/dashboard-stats';
import { RecentReviewsWidget } from '@/components/tenant/recent-reviews-widget';
import { SalesChartWidget } from '@/components/tenant/sales-chart-widget';
import { Separator } from '@/components/ui/separator';

export default function TenantDashboardPage() {
  // Pastikan tidak ada data statis atau useState di sini

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Selamat datang kembali! Berikut adalah ringkasan performa properti Anda.
        </p>
      </div>
      <Separator />

      {/* Panggil komponen langsung tanpa props. Ini cara yang benar. */}
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChartWidget />
        </div>
        <div className="lg:col-span-3">
          <RecentReviewsWidget />
        </div>
      </div>
    </div>
  );
}