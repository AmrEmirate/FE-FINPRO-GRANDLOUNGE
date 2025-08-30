"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Eye, Edit, Trash2, MapPin, BedDouble, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Property } from "@/lib/types" // Impor tipe data Property dari types

// Definisikan props untuk komponen
interface PropertiesGridProps {
  properties: Property[];
  searchTerm: string;
  onDeleteProperty: (id: string) => void;
}

export function PropertiesGrid({ properties, searchTerm, onDeleteProperty }: PropertiesGridProps) {
  // Logika untuk memfilter properti berdasarkan input pencarian
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Tampilan jika tidak ada properti yang ditemukan
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
                    src={property.mainImage || "/placeholder.svg"} // Gunakan gambar asli atau placeholder
                    alt={property.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                />
            </Link>
            {/* Tampilkan badge kategori dan status secara dinamis */}
            <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{property.category.name}</Badge>
            <Badge variant={!property.deletedAt ? "default" : "destructive"} className="absolute top-3 right-3">
              {!property.deletedAt ? "Active" : "Archived"}
            </Badge>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg truncate">{property.name}</CardTitle>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              {/* Tampilkan lokasi dari data API */}
              <span className="truncate">{property.city.name}, {property.city.provinsi}</span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <BedDouble className="h-4 w-4 mr-1" />
              {/* Tampilkan jumlah kamar dari data API */}
              {property.rooms?.length || 0} rooms
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Arahkan link ke halaman detail dan edit yang benar */}
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
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDeleteProperty(property.id)} 
                    title="Delete Property"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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