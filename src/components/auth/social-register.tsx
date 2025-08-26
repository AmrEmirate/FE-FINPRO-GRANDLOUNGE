"use client"

import { Button } from "@/components/ui/button"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export function SocialRegister() {
  const handleSocialLogin = (provider: string) => {
    // Static navigation without API calls
    console.log(`${provider} login clicked`)
    // In a real app, this would redirect to OAuth provider
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center justify-center gap-2"
        >
          <FaGoogle className="w-4 h-4 text-red-500" />
          <span className="hidden sm:inline">Google</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialLogin("facebook")}
          className="w-full flex items-center justify-center gap-2"
        >
          <FaFacebook className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialLogin("x")}
          className="w-full flex items-center justify-center gap-2"
        >
          <FaXTwitter className="w-4 h-4 text-black" />
          <span className="hidden sm:inline">X</span>
        </Button>
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
