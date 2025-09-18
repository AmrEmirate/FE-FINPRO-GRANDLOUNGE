"use client"

import { Button } from "@/components/ui/button"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import React from "react" // Import React untuk JSX.Element

// 1. Definisikan tipe untuk provider sosial
type SocialProvider = {
  name: string
  provider: "google" | "facebook" | "x"
  icon: JSX.Element
}

// 2. Buat array konfigurasi untuk setiap tombol
const socialProviders: SocialProvider[] = [
  {
    name: "Google",
    provider: "google",
    icon: <FaGoogle className="h-4 w-4 text-red-500" />,
  },
  {
    name: "Facebook",
    provider: "facebook",
    icon: <FaFacebook className="h-4 w-4 text-blue-600" />,
  },
  {
    name: "X",
    provider: "x",
    icon: <FaXTwitter className="h-4 w-4 text-black" />,
  },
]

export function SocialRegister() {
  const handleSocialLogin = (provider: string) => {
    // Di aplikasi nyata, ini akan mengarahkan ke penyedia OAuth
    // console.log sudah dihapus
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {/* 3. Gunakan .map() untuk me-render tombol secara dinamis */}
        {socialProviders.map(({ name, provider, icon }) => (
          <Button
            key={provider}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            className="flex w-full items-center justify-center gap-2"
          >
            {icon}
            <span className="hidden sm:inline">{name}</span>
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>
    </div>
  )
}