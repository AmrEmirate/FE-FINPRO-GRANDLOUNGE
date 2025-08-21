import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Heart, Star } from "lucide-react"

export function AboutValues() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "We prioritize the safety and security of our guests and property owners through verified listings and secure payment processing.",
    },
    {
      icon: Heart,
      title: "Exceptional Service",
      description:
        "Our dedicated team provides 24/7 support to ensure every stay exceeds expectations and every host succeeds.",
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description:
        "Every property is carefully vetted and regularly reviewed to maintain our high standards of quality and comfort.",
    },
  ]

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Our Values</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What Drives Us Forward</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our core values guide every decision we make and every service we provide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-8">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
