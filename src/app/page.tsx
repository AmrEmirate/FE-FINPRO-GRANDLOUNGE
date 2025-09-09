// src/app/page.tsx

"use client"; // Ubah menjadi Client Component

import { useState } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { SearchForm, SearchQuery } from '@/components/home/search-form'; // Impor tipe SearchQuery
import { FeaturedProperties } from '@/components/home/featured-properties';
import { Footer } from '@/components/layout/footer';
import { AboutStory } from '@/components/about/about-story';
import { AboutStats } from '@/components/about/about-stats';
import { AboutMission } from '@/components/about/about-mission';
import { AboutValues } from '@/components/about/about-values';
import { AboutTeam } from '@/components/about/about-team';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function HomePage() {
  // State untuk menyimpan kriteria pencarian
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Kirim fungsi setSearchQuery ke SearchForm */}
      <SearchForm onSearch={setSearchQuery} />
      {/* Kirim state searchQuery ke FeaturedProperties */}
      <FeaturedProperties filter={searchQuery} />
      <section id="about" className="py-12">
        <div className="container mx-auto">
          <AboutStory />
          <AboutStats />
          <AboutMission />
          <AboutValues />
        </div>
      </section>
      <Link href="/contact" passHref>
        <Button
          className="fixed bottom-8 right-8 bg-black hover:bg-black/80 text-white rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width: isHovered ? '140px' : '56px', height: '56px' }} // Atur perubahan lebar
        >
          {isHovered ? (
            <span>Contact Us</span>
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </Button>
      </Link>
      <Footer />
    </div>
  );
}