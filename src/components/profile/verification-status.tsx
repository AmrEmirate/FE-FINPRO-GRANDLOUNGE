"use client"

import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle, XCircle, Mail } from "lucide-react"

interface User {
  id: number
  fullName: string
  email: string
  profilePicture?: string
  verified: boolean
  createdAt: Date
}

interface VerificationStatusProps {
  user: User
  isLoading: boolean
  onEmailVerification: () => void
}

export function VerificationStatus({ user, isLoading, onEmailVerification }: VerificationStatusProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-medium">Email Verification</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {user.verified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="default" className="bg-green-100 text-green-800">
                Verified
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <Badge variant="destructive">Not Verified</Badge>
            </>
          )}
        </div>
      </div>

      {!user.verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Email Verification Required</h3>
              <p className="text-sm text-amber-700 mt-1">
                Please verify your email address to secure your account and receive important updates.
              </p>
              <Button onClick={onEmailVerification} disabled={isLoading} className="mt-3" size="sm">
                {isLoading ? "Sending..." : "Send Verification Email"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <h4 className="font-medium mb-2">Verification Benefits:</h4>
        <ul className="space-y-1">
          <li>• Enhanced account security</li>
          <li>• Access to all platform features</li>
          <li>• Priority customer support</li>
          <li>• Booking confirmations and updates</li>
        </ul>
      </div>
    </div>
  )
}
