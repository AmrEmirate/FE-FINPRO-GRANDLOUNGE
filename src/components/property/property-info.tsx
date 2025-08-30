import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import type { Property } from "@/lib/types" // Impor tipe Property yang sudah diperbarui

// Ubah interface props untuk menerima objek Property
interface PropertyInfoProps {
  property: Property
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  // Hitung rata-rata rating dan jumlah review dari data API secara dinamis
  const reviewCount = property.reviews?.length || 0
  const averageRating =
    reviewCount > 0
      ? property.reviews!.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
        {/* Informasi Utama Properti */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-sm">{property.category.name}</Badge>
            {reviewCount > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="ml-1">({reviewCount} reviews)</span>
                </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            {/* Menggunakan data dari city object yang berelasi */}
            <span>{property.city.name}, {property.city.provinsi}</span>
          </div>
        </div>
      </div>

      {/* Deskripsi Properti */}
      <p className="text-gray-700 mb-6 leading-relaxed">{property.description}</p>

      <Separator className="my-6" />

      {/* Informasi Host/Tenant dari data API */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Hosted by</h3>
        <div className="flex items-center gap-4">
          <Image
            src={property.tenant.user.profilePicture || "/placeholder-user.jpg"}
            alt={`Profile of ${property.tenant.user.fullName}`}
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{property.tenant.user.fullName}</h4>
            <p className="text-sm text-gray-600">Joined since {format(new Date(property.tenant.createdAt), "MMMM yyyy")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}