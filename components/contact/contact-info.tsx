import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  const contactCards = [
    {
      icon: MapPin,
      title: "Address",
      content: ["Jl. Sudirman No. 123", "Jakarta Pusat 10220", "Indonesia"],
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Phone,
      title: "Phone",
      content: ["+62 21 1234 5678", "+62 812 3456 7890"],
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      content: ["info@grandlodge.com", "support@grandlodge.com"],
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Sunday: Closed"],
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="lg:col-span-1 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-8">
          We're here to assist you with any questions about our properties, bookings, or services. Reach out to us
          through any of the following channels.
        </p>
      </div>

      <div className="space-y-6">
        {contactCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <div className="text-gray-600">
                    {card.content.map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
