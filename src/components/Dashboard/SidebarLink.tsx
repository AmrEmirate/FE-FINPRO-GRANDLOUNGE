// src/components/Dashboard/SidebarLink.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// Perbarui props: tambahkan icon dan children, hapus label
interface SidebarLinkProps {
    href: string;
    icon: ReactNode;
    children: ReactNode;
    active?: boolean;
}

export default function SidebarLink({ href, icon, children, active }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = active || pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${isActive ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50' : ''
                }`}
        >
            {icon}
            {children}
        </Link>
    );
}