'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Bell,
    Building,
    CreditCard,
    Home,
    LayoutDashboard,
    LineChart,
    Package,
    Settings,
    Star,
    Users,
    Wallet,
} from 'lucide-react';

export default function Sidebar() {
    const { user } = useAuth();

    const userNavItems = [
        { href: '/dashboard/akun_user/profile', label: 'Profil', icon: Users },
        { href: '/dashboard/akun_user/orders', label: 'Pesanan', icon: CreditCard },
        { href: '/dashboard/akun_user/review', label: 'Ulasan', icon: Star },
        { href: '/dashboard/akun_user/metode_pembayaran', label: 'Metode Pembayaran', icon: Wallet },
        { href: '/dashboard/akun_user/pengaturan', label: 'Pengaturan', icon: Settings },
    ];

    const tenantNavItems = [
        { href: '/tenant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tenant/properties', label: 'Properti', icon: Building },
        { href: '/tenant/transactions', label: 'Transaksi', icon: CreditCard },
        // { href: '/tenant/reports', label: 'Laporan', icon: LineChart },
    ];

    const navItems = user?.role === 'TENANT' ? tenantNavItems : userNavItems;
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span className="">GrandLounge</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                    (pathname === item.href || (item.href !== '/tenant/dashboard' && pathname.startsWith(item.href))) && 'bg-muted text-primary'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}