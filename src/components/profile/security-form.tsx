"use client"

import type React from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ShowPasswords {
  current: boolean
  new: boolean
  confirm: boolean
}

interface SecurityFormProps {
  passwordData: PasswordData
  showPasswords: ShowPasswords
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (data: PasswordData) => void
  onTogglePassword: (field: "current" | "new" | "confirm") => void
}

export function SecurityForm({
  passwordData,
  showPasswords,
  isLoading,
  onSubmit,
  onChange,
  onTogglePassword,
}: SecurityFormProps) {
  const handleInputChange = (field: keyof PasswordData, value: string) => {
    onChange({ ...passwordData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
            className="pl-10 pr-10"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => onTogglePassword("current")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            className="pl-10 pr-10"
            placeholder="Enter new password"
            minLength={8}
          />
          <button
            type="button"
            onClick={() => onTogglePassword("new")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="pl-10 pr-10"
            placeholder="Confirm new password"
            minLength={8}
          />
          <button
            type="button"
            onClick={() => onTogglePassword("confirm")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>Password requirements:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>At least 8 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include at least one number</li>
        </ul>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Change Password"}
      </Button>
    </form>
  )
}
