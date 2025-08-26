"use client"
import { useState } from "react"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { useProfile } from "@/hooks/use-profile"

export default function ProfilePage() {
  const [user] = useState({
    id: 1,
    fullName: "John Doe",
    email: "john@example.com",
    profilePicture: "/diverse-user-avatars.png",
    verified: true,
    createdAt: new Date("2023-01-15"),
  })

  const {
    profileData,
    passwordData,
    showPasswords,
    notifications,
    isLoading,
    setProfileData,
    setPasswordData,
    setNotifications,
    handleProfileUpdate,
    handlePasswordChange,
    handleAvatarUpload,
    handleEmailVerification,
    handleNotificationSave,
    togglePassword,
  } = useProfile(user)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <ProfileTabs
          user={user}
          profileData={profileData}
          passwordData={passwordData}
          showPasswords={showPasswords}
          notifications={notifications}
          isLoading={isLoading}
          onProfileUpdate={handleProfileUpdate}
          onPasswordChange={handlePasswordChange}
          onAvatarUpload={handleAvatarUpload}
          onEmailVerification={handleEmailVerification}
          onNotificationSave={handleNotificationSave}
          onProfileDataChange={setProfileData}
          onPasswordDataChange={setPasswordData}
          onNotificationsChange={setNotifications}
          onTogglePassword={togglePassword}
        />
      </div>
    </div>
  )
}
