"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    CreditCard,
    Star,
    User,
    Wallet,
    Package,
} from "lucide-react";

const navItems = [
    { href: "/dashboard/akun_user/profile", label: "Profil", icon: User },
    { href: "/dashboard/akun_user/orders", label: "Pesanan Anda", icon: CreditCard },
    { href: "/dashboard/akun_user/review", label: "Ulasan Saya", icon: Star },
    { href: "/dashboard/akun_user/metode_pembayaran", label: "Metode Pembayaran", icon: Wallet },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-white md:block w-64">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span>Grand Lodge</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => (
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
            </div>
        </div>
    );
}