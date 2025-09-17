// src/components/auth/EmailSentSuccess.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Building2 } from "lucide-react"

interface EmailSentSuccessProps {
  email: string;
}

export function EmailSentSuccess({ email }: EmailSentSuccessProps) {
  return (
    <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
        </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-gray-600">
            If an account with <strong>{email}</strong> exists, we've sent a link to it.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}