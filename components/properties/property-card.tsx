import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Wifi, Car, Coffee } from "lucide-react"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const averagePrice =
    property.rooms && property.rooms.length > 0 ? Math.min(...property.rooms.map((room) => room.basePrice)) : 0

  const maxCapacity =
    property.rooms && property.rooms.length > 0 ? Math.max(...property.rooms.map((room) => room.capacity)) : 0

  const reviewCount = property.reviews?.length || 0
  const averageRating =
    reviewCount > 0
      ? property.reviews!.reduce((sum, review) => sum + 5, 0) / reviewCount // Mock rating calculation
      : 4.5

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="relative">
          <Image
            src={property.mainImage || "/placeholder.svg"}
            alt={property.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-blue-600">{property.category.name}</Badge>
          {property.deletedAt && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Not Available
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {averageRating.toFixed(1)}
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.location}, {property.provinsi}
            </span>
          </div>

          {maxCapacity > 0 && (
            <div className="flex items-center text-gray-600 mb-3">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">Up to {maxCapacity} guests</span>
            </div>
          )}

          {/* Amenities */}
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="h-4 w-4 text-gray-400" />
            <Car className="h-4 w-4 text-gray-400" />
            <Coffee className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              {averagePrice > 0 && (
                <>
                  <span className="text-xl font-bold text-blue-600">Rp {averagePrice.toLocaleString("id-ID")}</span>
                  <span className="text-sm text-gray-600 ml-1">/night</span>
                </>
              )}
            </div>
            <span className="text-sm text-gray-500">{reviewCount} reviews</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
