// src/app/tenant/layout.tsx

import ProtectedRoute from "@/components/auth/ProtectedRoute";
// PERBAIKAN: Impor dari file sidebar tenant yang baru
import TenantSidebar from "@/components/tenant/tenant-sidebar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute role="TENANT">
      <div className="flex min-h-screen">
        <TenantSidebar />
        <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}