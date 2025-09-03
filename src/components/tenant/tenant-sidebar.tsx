// src/components/tenant/tenant-sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Building,
    CreditCard,
    LineChart,
    Calendar,
    LogOut,
    Package,
    User, // 1. Impor ikon User
} from "lucide-react";
import { Button } from "@/components/ui/button";

// 2. Tambahkan item navigasi untuk Profil
const tenantNavItems = [
    { href: "/tenant/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tenant/properties", label: "Properti", icon: Building },
    { href: "/tenant/transactions", label: "Transaksi", icon: CreditCard },
    { href: "/tenant/reports/sales", label: "Laporan Penjualan", icon: LineChart },
    { href: "/tenant/reports/availability", label: "Ketersediaan", icon: Calendar },
    { href: "/tenant/profile", label: "Profil", icon: User }, // Item baru
];

export default function TenantSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="hidden border-r bg-white md:block w-64">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span>Grand Lodge (Tenant)</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {tenantNavItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
                                    (pathname === item.href) && "bg-gray-100 text-gray-900"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Button>
                </div>
            </div>
        </div>
    );
}