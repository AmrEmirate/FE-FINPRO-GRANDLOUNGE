'use client';

import { ReactNode } from 'react';
import TenantSidebar from '@/components/Dashboard/akun_tenant/Sidebar'; // <- Menggunakan sidebar tenant yang sudah diperbarui
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute role="TENANT">
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

        {/* Sidebar untuk Desktop */}
        <aside className="hidden border-r bg-muted/40 md:block">
          <TenantSidebar />
        </aside>

        <div className="flex flex-col overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

            {/* Tombol menu untuk Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <TenantSidebar />
              </SheetContent>
            </Sheet>

            {/* Header Konten bisa ditambahkan di sini jika perlu */}
          </header>

          <main className="flex-1 p-4 sm:px-6 sm:py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}