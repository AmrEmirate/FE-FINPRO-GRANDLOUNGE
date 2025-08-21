"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Property {
  id: number
  name: string
  location: string
  rooms: number
  status: string
  views: number
  createdAt: Date
}

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
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{property.name}</h3>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{property.rooms} rooms</span>
                    <span className="text-xs text-gray-500">{property.views} views</span>
                    <Badge variant={property.status === "active" ? "default" : "secondary"}>{property.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
