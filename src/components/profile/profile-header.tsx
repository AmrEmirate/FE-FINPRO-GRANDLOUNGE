"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { useAuth } from "@/context/AuthContext" // Menggunakan user dari context

interface ProfileHeaderProps {
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileHeader({ onAvatarUpload }: ProfileHeaderProps) {
  const { user } = useAuth(); // Mengambil user dari context

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!user) {
    return null; // atau tampilkan skeleton loader
  }

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.profilePicture || "/placeholder-user.jpg"} alt={user.fullName} />
          <AvatarFallback className="text-lg">{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
          <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors">
            <Camera className="h-4 w-4" />
          </div>
          <input id="avatar-upload" type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" aria-label="Upload new profile picture" />
        </label>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
