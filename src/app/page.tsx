// src/app/page.tsx

"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic'; // 1. Impor 'dynamic' dari next/dynamic
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
import Navbar from '@/components/Navbar';

// 2. Muat SplitScreenMap secara dinamis dan nonaktifkan SSR
const SplitScreenMap = dynamic(() => import('@/components/home/split-screen-map'), {
  ssr: false,
  loading: () => <div className="h-[70vh] w-full bg-gray-200 animate-pulse flex items-center justify-center"><p>Loading map...</p></div>
});


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  const handleCategorySelect = (category: string) => {
    if (categoryFilter === category) {
      setCategoryFilter('');
    } else {
      setCategoryFilter(category);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onCategorySelect={handleCategorySelect} /> 
      
      <HeroSection />
      <SearchForm onSearch={setSearchQuery} />
      
      <FeaturedProperties filter={searchQuery} categoryFilter={categoryFilter} />

      <SplitScreenMap />

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
          style={{ width: isHovered ? '140px' : '56px', height: '56px' }}
        >
          {isHovered ? <span>Contact Us</span> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </Link>
      <Footer />
    </div>
  );
}