"use client"

import { useState } from "react"
import { HelpHero } from "@/components/help/help-hero"
import { HelpActions } from "@/components/help/help-actions"
import { HelpCategories } from "@/components/help/help-categories"
import { HelpFAQ } from "@/components/help/help-faq"
import { HelpSupport } from "@/components/help/help-support"

const faqs = [
  {
    category: "booking",
    question: "How do I make a booking?",
    answer:
      "To make a booking, search for your desired destination and dates, select a property, choose your room type, and complete the payment process.",
  },
  {
    category: "booking",
    question: "Can I modify or cancel my booking?",
    answer: "Yes, you can modify or cancel your booking depending on the property's cancellation policy.",
  },
  {
    category: "payment",
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, credit cards (Visa, Mastercard), and various digital payment methods.",
  },
  {
    category: "property",
    question: "How do I list my property?",
    answer:
      "To list your property, sign up as a property owner, complete your profile verification, and follow our step-by-step listing process.",
  },
  {
    category: "account",
    question: "How do I verify my account?",
    answer:
      "Account verification requires email confirmation and identity verification. Upload a valid ID document and follow the verification steps.",
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <HelpHero searchTerm={searchTerm} onSearch={setSearchTerm} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HelpActions />
        <HelpCategories onCategorySelect={setSelectedCategory} />
        <HelpFAQ
          faqs={filteredFaqs}
          selectedCategory={selectedCategory}
          onClearCategory={() => {
            setSelectedCategory("all")
            setSearchTerm("")
          }}
        />
        <HelpSupport />
      </div>
    </div>
  )
}
