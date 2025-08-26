import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Users } from 'lucide-react'

const featuredProperties = [
  {
    id: 1,
    name: 'Grand Lodge Downtown',
    location: 'Jakarta',
    price: 850000,
    rating: 4.8,
    reviews: 124,
    image: '/luxury-downtown-hotel.png',
    category: 'Hotel',
    maxGuests: 4,
  },
  {
    id: 2,
    name: 'Seaside Villa Resort',
    location: 'Bali',
    price: 1200000,
    rating: 4.9,
    reviews: 89,
    image: '/seaside-villa-resort.png',
    category: 'Villa',
    maxGuests: 8,
  },
  {
    id: 3,
    name: 'Mountain View Lodge',
    location: 'Bandung',
    price: 650000,
    rating: 4.7,
    reviews: 156,
    image: '/mountain-view-lodge.png',
    category: 'Lodge',
    maxGuests: 6,
  },
  {
    id: 4,
    name: 'Urban Boutique Hotel',
    location: 'Surabaya',
    price: 750000,
    rating: 4.6,
    reviews: 203,
    image: '/urban-boutique-hotel.png',
    category: 'Hotel',
    maxGuests: 2,
  },
]

export function FeaturedProperties() {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium accommodations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600">
                    {property.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {property.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">Up to {property.maxGuests} guests</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-600">
                        Rp {property.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">/night</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {property.reviews} reviews
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
