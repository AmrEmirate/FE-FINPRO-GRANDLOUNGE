"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isHome = pathname === "/";

    const placeholders = ["Cari Hotel...", "Cari Villa...", "Cari Apartemen..."];
    const [index, setIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % placeholders.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Sembunyikan navbar di auth/dashboard/tenant
    if (pathname.startsWith("/auth")) return null;
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/tenant")) return null;

    const navbarBg = isHome ? "bg-transparent" : "bg-black shadow-md text-white";
    const navbarPosition = isHome ? "absolute" : "fixed";

    return (
        <>
            {/* NAVBAR */}
            <nav
                className={`${navbarPosition} top-0 left-0 w-full flex items-center h-20 px-6 lg:px-12 z-50 gap-6 transition-all duration-300 ${navbarBg}`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img src="/assets/LONGE.png" alt="Logo" className="h-12 w-auto" />
                </Link>

                {/* Search Bar */}
                <div className="flex items-center mx-4 flex-1 max-w-md relative">
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
                </div>

                {/* MENU (Desktop) */}
                <div className="hidden lg:flex gap-6 text-white">
                    <Link href="/properties">Properti</Link>
                    <Link href="/about">Tentang Kami</Link>
                    <Link href="/contact">Kontak</Link>
                </div>

                {/* Auth Section */}
                <div className="ml-auto hidden lg:flex gap-3 items-center">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.profilePicture || "/placeholder-user.jpg"} alt={user?.fullName} />
                                        <AvatarFallback>{user?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-3 rounded-2xl shadow-xl cursor-pointer">
                                {[
                                    { label: "Akun", href: "/dashboard/akun_user/profile" },
                                    { label: "Your Orders", href: "/dashboard/akun_user/orders" },
                                    { label: "Metode Pembayaran", href: "/dashboard/akun_user/metode_pembayaran" },
                                    { label: "My Review", href: "/dashboard/akun_user/review" },
                                    { label: "Pengaturan", href: "/dashboard/akun_user/pengaturan" },
                                ].map((item) => (
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
                            <Link href="/auth/login">
                                <Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition">
                                    Daftar
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <div className="ml-auto lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="text-white w-7 h-7" /> : <Menu className="text-white w-7 h-7" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-20 left-0 w-full bg-white cursor-pointer shadow-md p-6 flex flex-col gap-4 lg:hidden z-40"
                    >
                        {user ? (
                            <div className="mt-4">
                                {[
                                    { label: "Akun", href: "/dashboard/akun_user/profile" },
                                    { label: "Your Orders", href: "/dashboard/akun_user/orders" },
                                    { label: "Metode Pembayaran", href: "/dashboard/akun_user/metode_pembayaran" },
                                    { label: "My Review", href: "/dashboard/akun_user/review" },
                                    { label: "Pengaturan", href: "/dashboard/akun_user/pengaturan" },
                                ].map((item) => (
                                    <Link key={item.href} href={item.href} className="block py-2 text-gray-700" onClick={() => setIsOpen(false)}>
                                        {item.label}
                                    </Link>
                                ))}

                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="text-red-500 mt-3"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link href="/auth/login">
                                    <Button className="w-full">Masuk</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="w-full bg-black text-white">Daftar</Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
