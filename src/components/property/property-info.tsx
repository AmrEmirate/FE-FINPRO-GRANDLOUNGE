import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { Star, MapPin, Wifi, Car, Coffee, PocketIcon as Pool, Dumbbell } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

interface PropertyInfoProps {
  property: {
    name: string
    location: string
    category: string
    rating: number
    reviews: number
    description: string
    fullDescription: string
    amenities: string[]
    host: {
      name: string
      avatar: string
      joinedDate: string
      responseRate: number
      responseTime: string
    }
    policies: {
      checkIn: string
      checkOut: string
      cancellation: string
    }
  }
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-4 w-4 mr-2" />
      case "Parking":
        return <Car className="h-4 w-4 mr-2" />
      case "Pool":
        return <Pool className="h-4 w-4 mr-2" />
      case "Gym":
        return <Dumbbell className="h-4 w-4 mr-2" />
      case "Restaurant":
        return <Coffee className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{property.category}</Badge>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {property.rating} ({property.reviews} reviews)
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6">{property.description}</p>

      {/* Amenities */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {property.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center text-gray-600">
              {getAmenityIcon(amenity)}
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Full Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">About this property</h3>
        <p className="text-gray-700 leading-relaxed">{property.fullDescription}</p>
      </div>

      <Separator className="my-6" />

      {/* Host Info */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={property.host.avatar || "/placeholder.svg"}
          alt={property.host.name}
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <h4 className="font-semibold">{property.host.name}</h4>
          <p className="text-sm text-gray-600">Joined {format(new Date(property.host.joinedDate), "MMMM yyyy")}</p>
          <p className="text-sm text-gray-600">
            {property.host.responseRate}% response rate • Responds within {property.host.responseTime}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Policies */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">Check-in</h4>
            <p className="text-gray-600">{property.policies.checkIn}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Check-out</h4>
            <p className="text-gray-600">{property.policies.checkOut}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Cancellation</h4>
            <p className="text-gray-600">{property.policies.cancellation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
