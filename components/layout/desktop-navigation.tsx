"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Help", href: "/help" },
]

export function DesktopNavigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex space-x-8">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors ${
            pathname === item.href ? "text-amber-600" : ""
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
