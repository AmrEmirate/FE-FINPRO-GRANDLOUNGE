"use client"
import { Input } from "@/src/components/ui/input"
import { Search } from "lucide-react"

interface HelpHeroProps {
  searchTerm: string
  onSearch: (term: string) => void
}

export function HelpHero({ searchTerm, onSearch }: HelpHeroProps) {
  return (
    <div className="bg-blue-600 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help you?</h1>
        <p className="text-xl opacity-90 mb-8">
          Find answers to common questions or get in touch with our support team
        </p>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-12 py-4 text-lg bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  )
}
