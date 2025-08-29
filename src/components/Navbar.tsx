"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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

            {/* Navigation Links (desktop only) */}
            <ul className="hidden lg:flex items-center gap-6 text-white font-medium">
                <li>
                    <Link href="/hotel" className="hover:text-black transition">
                        Hotel
                    </Link>
                </li>
                <li>
                    <Link href="/villa" className="hover:text-black transition">
                        Villa
                    </Link>
                </li>
                <li>
                    <Link href="/apartement" className="hover:text-black transition">
                        Apartemen
                    </Link>
                </li>
            </ul>

            {/* Auth Buttons (desktop only) */}
            <div className="ml-auto hidden lg:flex gap-3">
                <a href="/Sign-In">
                    <Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">
                        Masuk
                    </Button>
                </a>

                <Button className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition">
                    Daftar
                </Button>
            </div>

            {/* Mobile menu toggle (hamburger) */}
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
                    <Link href="/hotel" onClick={() => setIsOpen(false)}>
                        Hotel
                    </Link>
                    <Link href="/villa" onClick={() => setIsOpen(false)}>
                        Villa
                    </Link>
                    <Link href="/apartement" onClick={() => setIsOpen(false)}>
                        Apartemen
                    </Link>

                    <div className="flex gap-4 pt-4">
                        <Button className="px-6 py-2 rounded-lg bg-white text-black font-medium shadow hover:bg-gray-100 transition">
                            Masuk
                        </Button>
                        <Button className="px-6 py-2 rounded-lg bg-black text-white font-medium shadow hover:bg-gray-500 transition">
                            Daftar
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
