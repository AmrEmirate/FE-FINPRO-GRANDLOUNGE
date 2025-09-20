"use client";

import React from 'react';
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onCategorySelect?: (category: string) => void;
}

export default function Navbar({ onCategorySelect }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    const placeholders = ["Cari Hotel...", "Cari Vila...", "Cari Apartemen..."];
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % placeholders.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value.trim()) return;
        const params = new URLSearchParams();
        params.set('q', value);
        router.push(`/properties?${params.toString()}`);
    };

    if (pathname.startsWith("/auth")) return null;

    const isDashboardPage = pathname.startsWith("/dashboard") || pathname.startsWith("/tenant");
    const isHome = pathname === "/";

    const navbarBg = isHome ? "bg-transparent" : "bg-gray-900 shadow-md border-b border-gray-800";
    const textColor = "text-white";
    const navbarPosition = isHome ? "absolute" : "fixed";

    const userMenuItems = [
        { label: "Akun", href: "/dashboard/akun_user/profile" },
        { label: "Metode Pembayaran", href: "/dashboard/akun_user/metode_pembayaran" },
        { label: "Pesanan Saya", href: "/dashboard/akun_user/orders" },
        { label: "Ulasan Saya", href: "/dashboard/akun_user/review" },
    ];

    const tenantMenuItems = [
        { label: "Dashboard", href: "/tenant/dashboard" },
        { label: "Profil", href: "/tenant/profile" },
        { label: "Properti", href: "/tenant/properties" },
        { label: "Transaksi", href: "/tenant/transactions" },
        { label: "Ulasan", href: "/tenant/reviews" },
        { label: "Laporan Penjualan", href: "/tenant/reports/sales" },
        { label: "Laporan Ketersediaan", href: "/tenant/reports/availability" },
    ];

    const menuItems = user?.role === 'TENANT' ? tenantMenuItems : userMenuItems;

    return (
        <>
            <nav
                className={`${navbarPosition} top-0 left-0 w-full flex items-center h-20 px-6 lg:px-12 z-50 gap-6 transition-all duration-300 ${navbarBg} ${textColor}`}
            >
                <Link href="/" className="flex items-center">
                    <img src="/assets/LONGE.png" alt="Logo" className="h-12 w-auto" />
                </Link>

                {!isDashboardPage && (
                    <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center mx-4 flex-1 max-w-md relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="pl-12 pr-4 h-12 rounded-full w-full bg-white text-black shadow-md !border-0 focus:!border-0 focus:!ring-0 focus:!outline-none"
                        />
                        {!isFocused && !value && (
                            <div className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={index}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="block"
                                    >
                                        {placeholders[index]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        )}
                    </form>
                )}

                <div className={`hidden lg:flex gap-6 ${isDashboardPage ? 'ml-auto' : ''}`}>
                    <Link href="/properties" className="cursor-pointer">Properti</Link>
                    {onCategorySelect ? (
                        <>
                            <button onClick={() => onCategorySelect('Hotel')} className="cursor-pointer">Hotel</button>
                            <button onClick={() => onCategorySelect('Vila')} className="cursor-pointer">Vila</button>
                            <button onClick={() => onCategorySelect('Apartemen')} className="cursor-pointer">Apartemen</button>
                        </>
                    ) : (
                        <>
                            <Link href="/properties?category=Hotel">Hotel</Link>
                            <Link href="/properties?category=Vila">Vila</Link>
                            <Link href="/properties?category=Apartemen">Apartemen</Link>
                        </>
                    )}
                </div>

                <div className="ml-auto hidden lg:flex gap-3 items-center">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={user?.profilePicture || "/placeholder-user.jpg"}
                                            alt={user?.fullName || "User"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        <AvatarFallback>{user?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-3 rounded-2xl shadow-xl cursor-pointer">
                                {menuItems.map((item) => (
                                    <DropdownMenuItem asChild key={item.href}>
                                        <Link href={item.href}>{item.label}</Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/auth/login"><Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">Masuk</Button></Link>
                            <Link href="/auth/register"><Button className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition">Daftar</Button></Link>
                        </>
                    )}
                </div>

                <div className="ml-auto lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}</button>
                </div>
            </nav>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 w-full bg-gray-900 border-t border-gray-800 shadow-md p-6 flex flex-col gap-4 lg:hidden z-40"
                    >
                        {user ? (
                            <div className="mt-4">
                                {menuItems.map((item) => (
                                    <Link key={item.href} href={item.href} className="block py-2 text-gray-300 hover:text-yellow-400" onClick={() => setIsOpen(false)}>{item.label}</Link>
                                ))}
                                <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 mt-3">Keluar</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link href="/auth/login"><Button className="w-full">Masuk</Button></Link>
                                <Link href="/auth/register"><Button className="w-full bg-black text-white">Daftar</Button></Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}