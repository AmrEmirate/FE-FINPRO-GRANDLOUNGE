"use client"

import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Switch } from "@/src/components/ui/switch"

interface Notifications {
  emailUpdates: boolean
  emailPromotions: boolean
  pushNotifications: boolean
}

interface NotificationSettingsProps {
  notifications: Notifications
  onChange: (notifications: Notifications) => void
  onSave: () => void
}

export function NotificationSettings({ notifications, onChange, onSave }: NotificationSettingsProps) {
  const handleToggle = (field: keyof Notifications) => {
    onChange({ ...notifications, [field]: !notifications[field] })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailUpdates">Email Updates</Label>
            <p className="text-sm text-gray-600">Receive updates about your bookings and account</p>
          </div>
          <Switch
            id="emailUpdates"
            checked={notifications.emailUpdates}
            onCheckedChange={() => handleToggle("emailUpdates")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailPromotions">Email Promotions</Label>
            <p className="text-sm text-gray-600">Receive promotional offers and deals</p>
          </div>
          <Switch
            id="emailPromotions"
            checked={notifications.emailPromotions}
            onCheckedChange={() => handleToggle("emailPromotions")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pushNotifications">Push Notifications</Label>
            <p className="text-sm text-gray-600">Receive push notifications on your device</p>
          </div>
          <Switch
            id="pushNotifications"
            checked={notifications.pushNotifications}
            onCheckedChange={() => handleToggle("pushNotifications")}
          />
        </div>
      </div>

      <Button onClick={onSave}>Save Preferences</Button>
    </div>
  )
}
