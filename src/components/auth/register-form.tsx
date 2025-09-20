"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Building, MapPin, Phone } from "lucide-react"

interface RegisterFormProps {
  userType: string
  formData: {
    fullName: string
    email: string
    companyName: string
    addressCompany: string
    phoneNumberCompany: string
  }
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function RegisterForm({ userType, formData, isLoading, onSubmit, onChange }: RegisterFormProps) {
  return (
    <>
      <Separator className="my-4" />
      <div className="text-center text-sm text-gray-600 mb-4">Or register with email</div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={onChange}
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
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={onChange}
              className="pl-10"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {userType === "tenant" && (
          <>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={onChange}
                  className="pl-10"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="addressCompany">Company Address</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="addressCompany"
                  name="addressCompany"
                  type="text"
                  required
                  value={formData.addressCompany}
                  onChange={onChange}
                  className="pl-10"
                  placeholder="Enter your company address"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phoneNumberCompany">Company Phone</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phoneNumberCompany"
                  name="phoneNumberCompany"
                  type="tel"
                  required
                  value={formData.phoneNumberCompany}
                  onChange={onChange}
                  className="pl-10"
                  placeholder="Enter your company phone"
                />
              </div>
            </div>
          </>
        )}

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-400" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </>
  )
}
