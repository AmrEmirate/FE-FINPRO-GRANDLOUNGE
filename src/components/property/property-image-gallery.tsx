"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"

interface PropertyImageGalleryProps {
  images: string[]
  propertyName: string
}

export function PropertyImageGallery({ images, propertyName }: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image src={images[currentImageIndex] || "/placeholder.svg"} alt={propertyName} fill className="object-cover" />

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Thumbnails */}
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
 index === currentImageIndex ? "ring-2 ring-blue-500" : ""
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${propertyName} ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
