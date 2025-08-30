"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

// Tipe data untuk state password
interface PasswordData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Tipe data untuk state visibilitas password
interface ShowPasswordsState {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

// Definisikan props yang diterima komponen
interface SecurityFormProps {
  passwordData: PasswordData;
  showPasswords: ShowPasswordsState;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (data: PasswordData) => void;
  onTogglePassword: (field: keyof ShowPasswordsState) => void;
}

export function SecurityForm({
  passwordData,
  showPasswords,
  isLoading,
  onSubmit,
  onChange,
  onTogglePassword,
}: SecurityFormProps) {
  // Fungsi untuk menangani perubahan pada input field
  const handleInputChange = (field: keyof PasswordData, value: string) => {
    onChange({ ...passwordData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Input untuk Current Password */}
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            value={passwordData.currentPassword || ""}
            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
            className="pl-10 pr-10"
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            title={showPasswords.current ? "Hide password" : "Show password"} // Perbaikan aksesibilitas
            onClick={() => onTogglePassword("current")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Input untuk New Password */}
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            value={passwordData.newPassword || ""}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            className="pl-10 pr-10"
            placeholder="Enter new password"
            minLength={8}
            required
          />
          <button
            type="button"
            title={showPasswords.new ? "Hide password" : "Show password"} // Perbaikan aksesibilitas
            onClick={() => onTogglePassword("new")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Input untuk Confirm New Password */}
      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwordData.confirmPassword || ""}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="pl-10 pr-10"
            placeholder="Confirm new password"
            minLength={8}
            required
          />
          <button
            type="button"
            title={showPasswords.confirm ? "Hide password" : "Show password"} // Perbaikan aksesibilitas
            onClick={() => onTogglePassword("confirm")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Change Password"}
        </Button>
      </div>
    </form>
  )
}