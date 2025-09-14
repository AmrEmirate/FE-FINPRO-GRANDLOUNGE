"use client";

import { useState } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { SearchForm, SearchQuery } from '@/components/home/search-form';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { Footer } from '@/components/layout/footer';
import { AboutStory } from '@/components/about/about-story';
import { AboutStats } from '@/components/about/about-stats';
import { AboutMission } from '@/components/about/about-mission';
import { AboutValues } from '@/components/about/about-values';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
// 1. Impor komponen peta split-screen yang baru
import SplitScreenMap from '@/components/home/split-screen-map'; 

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchForm onSearch={setSearchQuery} />
      <FeaturedProperties filter={searchQuery} />

      <SplitScreenMap />

      <section id="about" className="py-12">
        <div className="container mx-auto">
          <AboutStory />
          <AboutStats />
          <AboutMission />
          <AboutValues />
        </div>
      </section>

      {/* ... sisa kode (tombol contact dan footer) biarkan sama ... */}
      <Link href="/contact" passHref>
        <Button
          className="fixed bottom-8 right-8 bg-black hover:bg-black/80 text-white rounded-full p-4 transition-all duration-300 ease-in-out shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width: isHovered ? '140px' : '56px', height: '56px' }}
        >
          {isHovered ? <span>Contact Us</span> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </Link>
      <Footer />
    </div>
  );
}