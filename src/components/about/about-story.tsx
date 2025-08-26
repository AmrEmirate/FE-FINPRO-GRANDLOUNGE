import Image from "next/image"
import { Badge } from "@/src/components/ui/badge"

export function AboutStory() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Our Story</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Redefining Travel Experiences</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                Founded in 2019, Grand Lodge began with a simple mission: to make exceptional accommodations accessible
                to everyone while empowering property owners to share their unique spaces.
              </p>
              <p>
                What started as a small platform has grown into Indonesia's trusted marketplace for premium stays,
                connecting thousands of travelers with carefully curated properties across the archipelago.
              </p>
              <p>
                Today, we continue to innovate and expand, always keeping our commitment to quality, safety, and
                exceptional service at the heart of everything we do.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/about-story-image.png"
              alt="Grand Lodge Story"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
