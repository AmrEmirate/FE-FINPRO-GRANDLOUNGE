import { HeroSection } from '@/components/home/hero-section'
import { SearchForm } from '@/components/home/search-form'
import { FeaturedProperties } from '@/components/home/featured-properties'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchForm />
      <FeaturedProperties />
      <Footer />
    </div>
  )
}
