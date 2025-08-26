"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Book, CreditCard, Home, Users } from "lucide-react"

interface HelpCategoriesProps {
  onCategorySelect: (category: string) => void
}

export function HelpCategories({ onCategorySelect }: HelpCategoriesProps) {
  const categories = [
    {
      icon: Book,
      title: "Booking & Reservations",
      description: "Help with making, modifying, and canceling bookings",
      count: 12,
      category: "booking",
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Payment methods, refunds, and billing questions",
      count: 8,
      category: "payment",
    },
    {
      icon: Home,
      title: "Property Owners",
      description: "Listing properties and managing bookings",
      count: 15,
      category: "property",
    },
    {
      icon: Users,
      title: "Account & Profile",
      description: "Account settings, verification, and profile management",
      count: 6,
      category: "account",
    },
  ]

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onCategorySelect(category.category)}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <category.icon className="h-6 w-6 text-blue-600" />
                </div>
                <Badge variant="secondary">{category.count} articles</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
