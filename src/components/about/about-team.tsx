import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AboutTeam() {
  const team = [
    {
      name: "Gabriel Johnson",
      role: "CEO & Founder",
      image: "/assets/CTO1.png",
      description: "Hospitality industry veteran with 15+ years of experience.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/assets/CTO2.png",
      description: "Technology leader focused on creating seamless user experiences.",
    },
    {
      name: "John Rodriguez",
      role: "Head of Operations",
      image: "/assets/CTO3.png",
      description: "Ensures smooth operations and exceptional customer service.",
    },
  ]

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Our Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet the People Behind Grand Lodge</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our passionate team is dedicated to creating exceptional experiences for both guests and property owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center overflow-hidden">
              <div className="relative h-64">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
