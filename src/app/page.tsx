// src/app/page.tsx

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
import SplitScreenMap from '@/components/home/split-screen-map';
import Navbar from '@/components/Navbar'; // Impor Navbar

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>(''); // State baru untuk filter kategori
  const [isHovered, setIsHovered] = useState(false);

  // Fungsi untuk menangani klik kategori dari Navbar
  const handleCategorySelect = (category: string) => {
    // Jika kategori yang sama diklik lagi, reset filter
    if (categoryFilter === category) {
      setCategoryFilter('');
    } else {
      setCategoryFilter(category);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Berikan fungsi handleCategorySelect ke Navbar */}
      <Navbar onCategorySelect={handleCategorySelect} /> 
      
      <HeroSection />
      <SearchForm onSearch={setSearchQuery} />
      
      {/* Berikan state categoryFilter ke FeaturedProperties */}
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