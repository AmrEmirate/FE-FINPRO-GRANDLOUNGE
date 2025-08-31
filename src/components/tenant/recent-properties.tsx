"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, Edit, Trash2, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Property } from "@/lib/types" // Menggunakan tipe data Property global

interface RecentPropertiesProps {
  properties: Property[]
}

export function RecentProperties({ properties }: RecentPropertiesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Properties</CardTitle>
            <CardDescription>Your recently added properties</CardDescription>
          </div>
          <Link href="/tenant/properties">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Image
                  src={property.mainImage || "/placeholder.svg"}
                  alt={property.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{property.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.city.name}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{property.rooms?.length || 0} rooms</span>
                    <Badge variant={!property.deletedAt ? "default" : "secondary"}>
                      {!property.deletedAt ? "Active" : "Archived"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href={`/properties/${property.id}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                 <Link href={`/tenant/properties/${property.id}/edit`}>
                    <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}