// src/app/page.tsx

"use client"; // Ubah menjadi Client Component

import { useState } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { SearchForm, SearchQuery } from '@/components/home/search-form'; // Impor tipe SearchQuery
import { FeaturedProperties } from '@/components/home/featured-properties';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  // State untuk menyimpan kriteria pencarian
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Kirim fungsi setSearchQuery ke SearchForm */}
      <SearchForm onSearch={setSearchQuery} />
      {/* Kirim state searchQuery ke FeaturedProperties */}
      <FeaturedProperties filter={searchQuery} />
      <Footer />
    </div>
  );
}