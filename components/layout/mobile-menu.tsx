"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  isLoggedIn: boolean
  userType: "user" | "tenant"
  onClose: () => void
}

const navigationItems = [
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Help", href: "/help" },
]

export function MobileMenu({ isOpen, isLoggedIn, userType, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50 md:hidden">
      <nav className="px-4 py-2 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
              pathname === item.href
                ? "text-amber-600 bg-amber-50"
                : "text-gray-700 hover:text-amber-600 hover:bg-gray-50"
            }`}
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
        <div className="border-t pt-2 mt-2">
          {isLoggedIn ? (
            <>
              <Link
                href={userType === "tenant" ? "/tenant/dashboard" : "/profile"}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                onClick={onClose}
              >
                Profile
              </Link>
              <button
                // Anda bisa menambahkan logika logout di sini
                onClick={() => {
                  console.log("Logout clicked")
                  onClose()
                }}
                className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block px-3 py-2 text-base font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-md mt-1"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}