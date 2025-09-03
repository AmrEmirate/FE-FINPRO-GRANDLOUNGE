// src/components/Dashboard/akun_user/Sidebar.tsx

'use client';

import SidebarLink from '@/components/Dashboard/SidebarLink';
import {
    CreditCard,
    Settings,
    ShoppingCart,
    Star,
    User,
} from 'lucide-react';

const UserSidebar = () => {
    const links = [
        { href: '/dashboard/akun_user/profile', label: 'Profil Saya', icon: User },
        { href: '/dashboard/akun_user/orders', label: 'Riwayat Pesanan', icon: ShoppingCart },
        { href: '/dashboard/akun_user/review', label: 'Ulasan Saya', icon: Star },
        { href: '/dashboard/akun_user/metode_pembayaran', label: 'Metode Pembayaran', icon: CreditCard },
    ];

    return (
        <nav className="flex flex-col gap-2">
            {links.map((link) => (
                // Sesuaikan cara pemanggilan SidebarLink di sini
                <SidebarLink
                    key={link.href}
                    href={link.href}
                    icon={<link.icon className="h-5 w-5" />}
                >
                    {link.label}
                </SidebarLink>
            ))}
        </nav>
    );
};

export default UserSidebar;