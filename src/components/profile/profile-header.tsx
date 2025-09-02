"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"

// Komponen ini tidak perlu menerima props lagi
export function ProfileHeader() {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Tampilkan loading skeleton jika user belum ada
  if (!user) {
    return (
        <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2">
                <div className="h-6 w-40 rounded-md bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-48 rounded-md bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-32 rounded-md bg-gray-200 animate-pulse"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex items-center space-x-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.profilePicture || "/placeholder-user.jpg"} alt={user.fullName} />
        <AvatarFallback className="text-lg">{getInitials(user.fullName)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}