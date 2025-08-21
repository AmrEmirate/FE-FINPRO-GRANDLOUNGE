import Link from "next/link"
import { Building2 } from "lucide-react"

export function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Building2 className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">Grand Lodge</span>
    </Link>
  )
}
