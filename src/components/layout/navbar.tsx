"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { NavbarLogo } from "./navbar-logo"
import { DesktopNavigation } from "./desktop-navigation"
import { AuthButtons } from "./auth-buttons"
import { MobileMenu } from "./mobile-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"user" | "tenant">("user")

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavbarLogo />
          <DesktopNavigation />
          <AuthButtons isLoggedIn={isLoggedIn} userType={userType} />
          <MobileMenuButton isOpen={isOpen} onToggle={toggleMenu} />
        </div>

        <MobileMenu isOpen={isOpen} isLoggedIn={isLoggedIn} userType={userType} onClose={closeMenu} />
      </div>
    </nav>
  )
}

interface MobileMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
}

function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={onToggle}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  )
}
