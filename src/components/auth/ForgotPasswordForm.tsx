// src/components/auth/ForgotPasswordForm.tsx
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Building2 } from "lucide-react"

// Definisikan props yang dibutuhkan
interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ForgotPasswordForm({ email, setEmail, handleSubmit, isLoading }: ForgotPasswordFormProps) {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Building2 className="h-8 w-8 text-amber-600" />
          <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>We'll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
           <div className="mt-6 text-center">
             <Link href="/auth/login" className="inline-flex items-center text-sm text-amber-600">
               <ArrowLeft className="h-4 w-4 mr-1" />
               Back to Login
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}