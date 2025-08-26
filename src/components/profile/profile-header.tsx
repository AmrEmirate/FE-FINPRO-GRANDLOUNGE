"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Camera } from "lucide-react"

interface User {
  id: number
  fullName: string
  email: string
  profilePicture?: string
  verified: boolean
  createdAt: Date
}

interface ProfileHeaderProps {
  user: User
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileHeader({ user, onAvatarUpload }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.fullName} />
          <AvatarFallback className="text-lg">{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
          <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors">
            <Camera className="h-4 w-4" />
          </div>
          <input id="avatar-upload" type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" />
        </label>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500">Member since {user.createdAt.toLocaleDateString()}</p>
      </div>
    </div>
  )
}
