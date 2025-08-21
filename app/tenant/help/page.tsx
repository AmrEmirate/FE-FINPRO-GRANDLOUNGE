"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageCircle, Phone, Mail, Video, FileText, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function TenantHelpPage() {
  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Get instant help from our property owner support team",
      action: "Start Chat",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Phone,
      title: "Property Owner Hotline",
      description: "Call our dedicated property owner support line",
      action: "+62 21 1234 5679",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send detailed questions to our property team",
      action: "owners@grandlodge.com",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Video,
      title: "Video Tutorial",
      description: "Watch step-by-step guides for property management",
      action: "Watch Now",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ]

  const resources = [
    {
      icon: BookOpen,
      title: "Property Owner Guide",
      description: "Complete guide to listing and managing your properties",
      category: "Getting Started",
    },
    {
      icon: TrendingUp,
      title: "Pricing Optimization",
      description: "Learn how to set competitive prices for maximum bookings",
      category: "Revenue",
    },
    {
      icon: Users,
      title: "Guest Communication",
      description: "Best practices for communicating with guests",
      category: "Management",
    },
    {
      icon: FileText,
      title: "Legal & Compliance",
      description: "Understanding regulations and requirements",
      category: "Legal",
    },
  ]

  const faqs = [
    {
      question: "How do I list my first property?",
      answer:
        "To list your property, go to 'Add Property' in your dashboard. Fill in all required information including property details, location, amenities, and upload high-quality photos. Our team will review and approve your listing within 24-48 hours.",
    },
    {
      question: "What commission does Grand Lodge charge?",
      answer:
        "Grand Lodge charges a competitive commission of 15% on each successful booking. This includes payment processing, customer support, marketing, and platform maintenance.",
    },
    {
      question: "How do I receive payments?",
      answer:
        "Payments are automatically transferred to your registered bank account within 24 hours after guest check-in. You can track all payments in your dashboard under 'Earnings'.",
    },
    {
      question: "Can I set my own pricing?",
      answer:
        "Yes, you have full control over your pricing. You can set base prices, seasonal rates, and special offers. Our pricing optimization tools can help you maximize your revenue.",
    },
    {
      question: "How do I handle guest cancellations?",
      answer:
        "Cancellations are handled automatically based on your cancellation policy. Guests can cancel through the platform, and refunds are processed according to your policy settings.",
    },
    {
      question: "What if I need to cancel a guest's booking?",
      answer:
        "Host cancellations should be avoided as they affect your rating. If absolutely necessary, contact our support team immediately. Frequent cancellations may result in penalties or account suspension.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Owner Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed as a property owner on Grand Lodge
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Help Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div
                    className={`${action.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
                  >
                    <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <resource.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="px-6">
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Our property owner success team is here to help you maximize your earnings and provide excellent guest
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Contact Property Team</Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
