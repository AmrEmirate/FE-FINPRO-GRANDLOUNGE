"use client"

import { Button } from "@/components/ui/button"
import { FaGoogle } from "react-icons/fa"
import React from "react" 

type SocialProvider = {
  name: string
  provider: "google"
  icon: JSX.Element
}

const socialProviders: SocialProvider[] = [
  {
    name: "Google",
    provider: "google",
    icon: <FaGoogle className="h-4 w-4 text-red-500" />,
  },
]

export function SocialRegister() {
  const handleSocialLogin = (provider: string) => {

  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1">
        {socialProviders.map(({ name, provider, icon }) => (
          <Button
            key={provider}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            className="flex w-full items-center justify-center gap-2 rounded-full h-10 transition-colors duration-200 hover:bg-gray-50 border-gray-300 text-md"
          >
            {icon}
            <span className="inline">Sign up with {name}</span>
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
        </div>
      </div>
    </div>
  )
}
