"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Eye, Edit, Trash2, MapPin, Users, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Property {
  id: number
  name: string
  location: string
  provinsi: string
  category: string
  rooms: number
  status: string
  views: number
  mainImage: string
  createdAt: Date
}

interface PropertiesGridProps {
  properties: Property[]
  searchTerm: string
  onDeleteProperty: (id: number) => void
}

export function PropertiesGrid({ properties, searchTerm, onDeleteProperty }: PropertiesGridProps) {
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (filteredProperties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 text-center mb-6">
            {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first property."}
          </p>
          {!searchTerm && (
            <Link href="/tenant/properties/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProperties.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={property.mainImage || "/placeholder.svg"}
              alt={property.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <Badge className="absolute top-3 left-3 bg-blue-600">{property.category}</Badge>
            <Badge variant={property.status === "active" ? "default" : "secondary"} className="absolute top-3 right-3">
              {property.status}
            </Badge>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{property.name}</CardTitle>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}, {property.provinsi}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {property.rooms} rooms
              </div>
              <div className="text-sm text-gray-600">{property.views} views</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href={`/properties/${property.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/tenant/properties/${property.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onDeleteProperty(property.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500">Added {property.createdAt.toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
