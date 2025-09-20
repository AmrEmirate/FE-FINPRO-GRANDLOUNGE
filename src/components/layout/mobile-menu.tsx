// src/components/layout/mobile-menu.tsx

"use client";

import { usePathname } from "next/navigation";
import { mainNavItems, getUserNavItems, guestNavItems } from "@/lib/constants/navigation-data";
import { MobileMenuItem } from "./MobileMenuItem"; // Import komponen baru

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userType: "user" | "tenant";
  onClose: () => void;
  onLogout: () => void; // Tambahkan prop untuk logout
}

export function MobileMenu({ isOpen, isLoggedIn, userType, onClose, onLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50 md:hidden">
      <nav className="px-4 py-2 space-y-1">
        {/* Render menu utama */}
        {mainNavItems.map((item) => (
          <MobileMenuItem key={item.name} href={item.href} onClick={onClose}>
            {item.name}
          </MobileMenuItem>
        ))}

        <div className="border-t pt-2 mt-2">
          {isLoggedIn ? (
            <>
              {/* Render menu untuk user yang login */}
              {getUserNavItems(userType).map(item => (
                <MobileMenuItem key={item.name} href={item.href} onClick={onClose}>
                    {item.name}
                </MobileMenuItem>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Render menu untuk tamu */}
              {guestNavItems.map((item) => (
                <MobileMenuItem key={item.name} href={item.href} onClick={onClose} isPrimary={item.isPrimary}>
                  {item.name}
                </MobileMenuItem>
              ))}
            </>
          )}
        </div>
      </nav>
    </div>
  );
}