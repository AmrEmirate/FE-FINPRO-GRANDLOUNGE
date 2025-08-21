import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

interface AuthButtonsProps {
  isLoggedIn: boolean
  userType: "user" | "tenant"
}

export function AuthButtons({ isLoggedIn, userType }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="hidden md:flex items-center space-x-4">
        <Link href={userType === "tenant" ? "/tenant/dashboard" : "/profile"}>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        </Link>
        <Button variant="ghost" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/auth/login">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  )
}
