"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Eye, Edit, Trash2, MapPin, BedDouble, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Property } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PropertiesGridProps {
  properties: Property[];
  searchTerm: string;
  onDeleteProperty: (id: string) => void;
}

export function PropertiesGrid({ properties, searchTerm, onDeleteProperty }: PropertiesGridProps) {
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (filteredProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <Building2 className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">No Properties Found</h3>
        <p className="text-gray-500 mb-6">You haven't added any properties yet.</p>
        <Link href="/tenant/properties/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Property
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProperties.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <Link href={`/tenant/properties/${property.id}/rooms`}>
                <Image
                    src={property.mainImage || "/placeholder.svg"}
                    alt={property.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{property.category.name}</Badge>
            <Badge variant={!property.deletedAt ? "default" : "destructive"} className="absolute top-3 right-3">
              {!property.deletedAt ? "Active" : "Archived"}
            </Badge>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg truncate">{property.name}</CardTitle>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{property.city.name}, {property.city.provinsi}</span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <BedDouble className="h-4 w-4 mr-1" />
              {property.rooms?.length || 0} rooms
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href={`/properties/${property.id}`} target="_blank">
                  <Button variant="outline" size="sm" title="View Property (Public)">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/tenant/properties/${property.id}/edit`}>
                  <Button variant="outline" size="sm" title="Edit Property">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>

                {/* --- BAGIAN YANG DITAMBAHKAN --- */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        title="Delete Property"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        property and all associated data (including rooms and bookings).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteProperty(property.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* ------------------------------------ */}

              </div>
              <div className="text-xs text-gray-500">
                Added {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}