"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    User,
    CreditCard,
    Star,
    Heart,
    ShoppingCart,
    HelpCircle,
    Settings,
    LogOut,
    Award
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
const navItems = [
    { href: "/dashboard/akun_user/profile", label: "Akun Saya", icon: User },
    { href: "/dashboard/akun_user/metode_pembayaran", label: "Metode Pembayaran", icon: CreditCard },
    { href: "/dashboard/akun_user/orders", label: "Pesanan Saya", icon: ShoppingCart },
    { href: "/dashboard/akun_user/review", label: "Ulasan Saya", icon: Star },
    { href: "/dashboard/akun_user/wishlist", label: "Wishlist", icon: Heart },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <div className="hidden md:flex md:flex-col h-screen w-64 bg-black text-white">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                {/* Bagian Profil Pengguna */}
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={user?.profilePicture || "/placeholder-user.jpg"} alt={user?.email} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-md">{user?.fullName || "User"}</span>
                        <span className="text-sm text-gray-400">{user?.email}</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="flex flex-col gap-2 px-4 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white",
                                pathname === item.href && "bg-gray-800 text-white"
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