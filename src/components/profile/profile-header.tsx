"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"

export function ProfileHeader() {
  const { user } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    // Jika nama tidak ada, kembalikan inisial default atau string kosong
    if (!name) {
      return "G";
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Tampilkan loading skeleton jika data user belum siap
  if (!user) {
    return (
      <div className="flex animate-pulse items-center space-x-6">
        <div className="h-24 w-24 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-md bg-gray-200"></div>
          <div className="h-4 w-48 rounded-md bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // Tampilkan header profil jika data user sudah ada
  return (
    <div className="flex items-center space-x-6">
      <Avatar className="h-24 w-24 border">
        <AvatarImage 
          src={user.profilePicture || "/placeholder-user.jpg"} 
          alt={user.fullName || "User Avatar"} 
        />
        <AvatarFallback className="text-3xl">
          {getInitials(user.fullName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{user.fullName || "Nama Pengguna"}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}