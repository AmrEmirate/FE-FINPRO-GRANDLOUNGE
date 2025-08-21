import { Users, Building2, Star, Award } from "lucide-react"

export function AboutStats() {
  const stats = [
    { label: "Properties Listed", value: "10,000+", icon: Building2 },
    { label: "Happy Guests", value: "50,000+", icon: Users },
    { label: "Average Rating", value: "4.8/5", icon: Star },
    { label: "Years of Service", value: "5+", icon: Award },
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
