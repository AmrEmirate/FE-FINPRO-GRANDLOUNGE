"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    User,
    CreditCard,
    Star,
    ShoppingCart,
    LogOut,
    Award
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
    { href: "/dashboard/akun_user/profile", label: "Akun Saya", icon: User },
    { href: "/dashboard/akun_user/metode_pembayaran", label: "Metode Pembayaran", icon: CreditCard },
    { href: "/dashboard/akun_user/orders", label: "Pesanan Saya", icon: ShoppingCart },
    { href: "/dashboard/akun_user/review", label: "Ulasan Saya", icon: Star },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="flex h-full max-h-screen flex-col gap-2 bg-gray-900 text-white">
            <div className="flex-1 overflow-auto py-2">
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                    <Avatar className="h-20 w-20 border-2 border-gray-700">
                        <AvatarImage src={user?.profilePicture || "/placeholder-user.jpg"} alt={user?.fullName || "User"} />
                        <AvatarFallback className="text-xl bg-gray-700 text-white">
                            {user?.fullName ? getInitials(user.fullName) : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <p className="font-semibold text-md">{user?.fullName || "User"}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                </div>
                <Separator className="my-2 bg-gray-800" />
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-yellow-400",
                                pathname === item.href && "bg-gray-800 text-yellow-400"
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