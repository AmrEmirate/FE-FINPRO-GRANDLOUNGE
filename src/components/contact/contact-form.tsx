"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 1. Definisikan tipe dan konfigurasi untuk input fields
type FormField = {
  id: "name" | "email" | "phone" | "subject"
  label: string
  type: string
  placeholder: string
  required: boolean
}

const formFields: FormField[] = [
  { id: "name", label: "Full Name *", type: "text", placeholder: "Your full name", required: true },
  { id: "email", label: "Email Address *", type: "email", placeholder: "your@email.com", required: true },
  { id: "phone", label: "Phone Number", type: "tel", placeholder: "+62 812 3456 7890", required: false },
  { id: "subject", label: "Subject *", type: "text", placeholder: "What is this about?", required: true },
]

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

export function ContactForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  // 2. Pecah fungsi untuk mereset form
  const resetForm = () => {
    setFormData(initialFormData)
  }

  // 3. Rampingkan fungsi handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Logika pengiriman form (misal: API call) akan ada di sini
    // console.log sudah dihapus

    toast({
      title: "Message sent successfully",
      description: "We will get back to you within 24 hours.",
    })
    
    resetForm()
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Send us a Message</CardTitle>
          <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 4. Render input fields secara dinamis */}
              {formFields.map(({ id, label, type, placeholder, required }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type}
                    value={formData[id]}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    required={required}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                required
                placeholder="Tell us more about your inquiry..."
                rows={6}
              />
            </div>

            <Button type="submit" size="lg" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}