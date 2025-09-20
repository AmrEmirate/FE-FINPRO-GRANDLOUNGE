import { Suspense } from 'react';
import { DashboardStats } from '@/components/tenant/dashboard-stats';
import { RecentReviewsWidget } from '@/components/tenant/recent-reviews-widget';
import { PendingConfirmationWidget } from '@/components/tenant/pending-confirmation-widget';
import { SalesChartWidget } from '@/components/tenant/sales-chart-widget';
import { Skeleton } from '@/components/ui/skeleton';

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dasbor Tenant</h1>

      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <DashboardStats />
      </Suspense>

      <PendingConfirmationWidget />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <SalesChartWidget />
          </Suspense>
        </div>
        <div className="space-y-6">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <RecentReviewsWidget />
          </Suspense>
        </div>
      </div>
    </div>
  );
}