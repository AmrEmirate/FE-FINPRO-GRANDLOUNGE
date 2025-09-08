"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Building,
    CreditCard,
    LineChart,
    Star,
    User,
    LogOut,
    Building2,
    CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const tenantNavItems = [
    { href: "/tenant/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tenant/profile", label: "Profil", icon: User },
    { href: "/tenant/properties", label: "Properti", icon: Building },
    { href: "/tenant/transactions", label: "Transaksi", icon: CreditCard },
    { href: "/tenant/reports/sales", label: "Laporan Penjualan", icon: LineChart },
    { href: "/tenant/reports/availability", label: "Laporan Ketersediaan", icon: CalendarCheck },
    { href: "/tenant/reviews", label: "Ulasan", icon: Star },
];

export default function TenantSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex md:flex-col h-screen w-64 bg-black text-white">
            <div className="flex-1 overflow-auto py-4">
                <nav className="flex flex-col gap-2 px-4 text-sm font-medium">
                    {tenantNavItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white",
                                pathname.startsWith(item.href) && "bg-gray-800 text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}