// src/app/auth/forgot-password/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { EmailSentSuccess } from "@/components/auth/EmailSentSuccess"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await apiHelper.post("/auth/password-reset/request", { email })
      setIsEmailSent(true) // Pindah ke tampilan sukses
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      {isEmailSent ? (
        <EmailSentSuccess email={email} />
      ) : (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}