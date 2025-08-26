"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail } from "lucide-react"

interface ProfileData {
  fullName: string
  email: string
}

interface ProfileFormProps {
  profileData: ProfileData
  originalEmail: string
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (data: ProfileData) => void
}

export function ProfileForm({ profileData, originalEmail, isLoading, onSubmit, onChange }: ProfileFormProps) {
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    onChange({ ...profileData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="fullName"
            value={profileData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="pl-10"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="pl-10"
            placeholder="Enter your email"
          />
        </div>
        {profileData.email !== originalEmail && (
          <p className="text-sm text-amber-600 mt-1">Changing your email will require verification</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}
