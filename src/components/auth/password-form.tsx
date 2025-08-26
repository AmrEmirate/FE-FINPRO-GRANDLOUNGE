"use client"

import type React from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

interface PasswordFormProps {
  formData: {
    password: string
    confirmPassword: string
  }
  showPassword: boolean
  showConfirmPassword: boolean
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTogglePassword: (field: "password" | "confirmPassword") => void
}

export function PasswordForm({
  formData,
  showPassword,
  showConfirmPassword,
  isLoading,
  onSubmit,
  onChange,
  onTogglePassword,
}: PasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={onChange}
            className="pl-10 pr-10"
            placeholder="Enter your password"
            minLength={8}
          />
          <button
            type="button"
            onClick={() => onTogglePassword("password")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={onChange}
            className="pl-10 pr-10"
            placeholder="Confirm your password"
            minLength={8}
          />
          <button
            type="button"
            onClick={() => onTogglePassword("confirmPassword")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify Email & Set Password"}
      </Button>
    </form>
  )
}
