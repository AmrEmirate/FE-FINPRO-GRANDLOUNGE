import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Check } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import type { Property } from "@/lib/types";

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const reviewCount = property.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? property.reviews!.reduce((sum, review) => sum + review.rating, 0) /
        reviewCount
      : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              {property.category.name}
            </Badge>
            {reviewCount > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="ml-1">({reviewCount} reviews)</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.name}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>
              {property.city.name}, {property.city.provinsi}
            </span>
          </div>
          {property.address && (
            <p className="mt-2 text-sm text-gray-500">{property.address}</p>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">
        {property.description}
      </p>

      {property.amenities && property.amenities.length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              What this place offers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="ml-2 text-gray-700">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator className="my-6" />

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Hosted by</h3>
        <div className="flex items-center gap-4">
          <Image
            src={property.tenant?.user?.profilePicture || "/placeholder-user.jpg"}
            alt={`Profile of ${property.tenant?.user?.fullName || "host"}`}
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <h4 className="font-semibold text-gray-900">
              {property.tenant?.user?.fullName || "Host"}
            </h4>
            {property.tenant?.createdAt && (
              <p className="text-sm text-gray-600">
                Joined since{" "}
                {format(new Date(property.tenant.createdAt), "MMMM yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}