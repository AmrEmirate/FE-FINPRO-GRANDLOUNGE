"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuth();

    // Sembunyikan navbar di halaman otentikasi
    if (pathname.startsWith('/auth')) {
        return null;
    }

    // Daftar link navigasi baru
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
                <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Cari Hotel, Villa, Apartemen..."
                    className="pl-12 pr-4 h-12 rounded-full w-full bg-white text-black placeholder-gray-500 shadow-md"
                />
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
                        <Link href={user?.role === 'TENANT' ? '/tenant/dashboard' : '/dashboard'}>
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                                <UserIcon className="mr-2 h-4 w-4" />
                                {user?.fullName}
                            </Button>
                        </Link>
                        <Button onClick={logout} variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
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
                         <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex gap-4 pt-4">
                        {isAuthenticated ? (
                             <>
                                <Link href={user?.role === 'TENANT' ? '/tenant/dashboard' : '/dashboard'} onClick={() => setIsOpen(false)}>
                                    <Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">
                                        {user?.fullName}
                                    </Button>
                                </Link>
                                <Button onClick={() => { logout(); setIsOpen(false); }} className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition">
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