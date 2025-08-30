"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuth();

    // Daftar placeholder
    const placeholders = ["Cari Hotel...", "Cari Villa...", "Cari Apartemen..."];
    const [index, setIndex] = useState(0);

    // State untuk search bar
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    // Ganti placeholder tiap 5 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % placeholders.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Sembunyikan navbar di halaman auth
    if (pathname.startsWith("/auth")) {
        return null;
    }

    const navLinks = [
        { name: "Hotel", href: "/properties?category=Hotel" },
        { name: "Villa", href: "/properties?category=Villa" },
        { name: "Apartemen", href: "/properties?category=Apartment" },
    ];

    return (
        <nav className="absolute top-0 left-0 w-full bg-transparent flex items-center h-20 px-6 lg:px-12 z-50 gap-6">
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

            {/* Navigation Links (Desktop) */}
            <ul className="hidden lg:flex items-center gap-6 text-white font-medium">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} className="hover:text-black transition">
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Auth Buttons (Desktop) */}
            <div className="ml-auto hidden lg:flex gap-3">
                {isAuthenticated ? (
                    <>
                        <Link
                            href={user?.role === "TENANT" ? "/tenant/dashboard" : "/dashboard"}
                        >
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/20 hover:text-white"
                            >
                                <UserIcon className="mr-2 h-4 w-4" />
                                {user?.fullName}
                            </Button>
                        </Link>
                        <Button
                            onClick={logout}
                            variant="ghost"
                            className="text-white hover:bg-white/20 hover:text-white"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </>
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
                    {isOpen ? (
                        <X className="text-white w-7 h-7" />
                    ) : (
                        <Menu className="text-white w-7 h-7" />
                    )}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {isOpen && (
                <div className="absolute top-20 left-0 w-full bg-black/30 backdrop-blur-md flex flex-col items-center gap-6 py-6 lg:hidden text-white">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex gap-4 pt-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={
                                        user?.role === "TENANT" ? "/tenant/dashboard" : "/dashboard"
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">
                                        {user?.fullName}
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                    <Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                    <Button className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition">
                                        Daftar
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
