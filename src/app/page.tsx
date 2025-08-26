import { HeroSection } from '@/src/components/home/hero-section'
import { SearchForm } from '@/src/components/home/search-form'
import { FeaturedProperties } from '@/src/components/home/featured-properties'
import { Footer } from '@/src/components/layout/footer'

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
