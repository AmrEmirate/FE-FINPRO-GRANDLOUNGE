import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { MessageCircle, Phone, Mail } from "lucide-react"

export function HelpActions() {
  const actions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      action: "Start Chat",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our support team",
      action: "+62 21 1234 5678",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Contact Form",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      href: "/contact",
    },
  ]

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Need immediate assistance?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div
                className={`${action.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
              >
                <action.icon className={`h-8 w-8 ${action.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              {action.href ? (
                <Link href={action.href}>
                  <Button variant="outline" className="w-full bg-transparent">
                    {action.action}
                  </Button>
                </Link>
              ) : (
                <Button className={index === 0 ? "w-full" : "w-full"} variant={index === 0 ? "default" : "outline"}>
                  {action.action}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
