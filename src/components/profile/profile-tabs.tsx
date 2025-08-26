"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"
import { ProfileHeader } from "./profile-header"
import { ProfileForm } from "./profile-form"
import { SecurityForm } from "./security-form"
import { NotificationSettings } from "./notification-settings"
import { VerificationStatus } from "./verification-status"

interface User {
  id: number
  fullName: string
  email: string
  profilePicture?: string
  verified: boolean
  createdAt: Date
}

interface ProfileData {
  fullName: string
  email: string
}

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

interface Notifications {
  emailUpdates: boolean
  emailPromotions: boolean
  pushNotifications: boolean
}

interface ProfileTabsProps {
  user: User
  profileData: ProfileData
  passwordData: PasswordData
  showPasswords: ShowPasswords
  notifications: Notifications
  isLoading: boolean
  onProfileUpdate: (e: React.FormEvent) => void
  onPasswordChange: (e: React.FormEvent) => void
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailVerification: () => void
  onNotificationSave: () => void
  onProfileDataChange: (data: ProfileData) => void
  onPasswordDataChange: (data: PasswordData) => void
  onNotificationsChange: (notifications: Notifications) => void
  onTogglePassword: (field: "current" | "new" | "confirm") => void
}

export function ProfileTabs({
  user,
  profileData,
  passwordData,
  showPasswords,
  notifications,
  isLoading,
  onProfileUpdate,
  onPasswordChange,
  onAvatarUpload,
  onEmailVerification,
  onNotificationSave,
  onProfileDataChange,
  onPasswordDataChange,
  onNotificationsChange,
  onTogglePassword,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileHeader user={user} onAvatarUpload={onAvatarUpload} />
            <Separator />
            <ProfileForm
              profileData={profileData}
              originalEmail={user.email}
              isLoading={isLoading}
              onSubmit={onProfileUpdate}
              onChange={onProfileDataChange}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your password and security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityForm
              passwordData={passwordData}
              showPasswords={showPasswords}
              isLoading={isLoading}
              onSubmit={onPasswordChange}
              onChange={onPasswordDataChange}
              onTogglePassword={onTogglePassword}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationSettings
              notifications={notifications}
              onChange={onNotificationsChange}
              onSave={onNotificationSave}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verification">
        <Card>
          <CardHeader>
            <CardTitle>Account Verification</CardTitle>
            <CardDescription>Verify your email for enhanced security</CardDescription>
          </CardHeader>
          <CardContent>
            <VerificationStatus user={user} isLoading={isLoading} onEmailVerification={onEmailVerification} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
