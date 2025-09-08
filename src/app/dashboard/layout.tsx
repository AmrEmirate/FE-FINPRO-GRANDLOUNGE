// src/app/dashboard/layout.tsx


'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserSidebar from '@/components/Dashboard/akun_user/Sidebar'; // Sidebar lama
import TenantSidebar from '@/components/Dashboard/akun_tenant/Sidebar'; // Sidebar baru
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Logika utama: Pilih komponen berdasarkan role
  const SidebarComponent = user?.role === 'TENANT' ? TenantSidebar : UserSidebar;


  return (

    <div className="flex min-h-screen w-full">
      <aside className="hidden flex-col border-r dark:bg-gray-800/40 md:flex">
        <SidebarComponent />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <span>Grand Lounge</span>
                </Link>
                <SidebarComponent />
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}