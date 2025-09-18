// src/components/home/search-form.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { DestinationSelect } from "./destination-select";
import { DatePicker } from "./date-picker";
import { GuestSelect } from "./guest-select";
import { useSearchForm, SearchFormState } from "@/hooks/use-search-form"; // Import hook
import type React from "react";

// Ubah nama tipe agar konsisten
export type { SearchFormState as SearchQuery };

interface SearchFormProps {
  onSearch: (query: SearchFormState | null) => void;
}

// Komponen kecil untuk membungkus setiap field
const SearchField: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = 
  ({ label, icon, children, className = "" }) => (
  <div className={className}>
    <Label className="text-sm font-medium text-gray-700 mb-2 block">
      {icon} {label}
    </Label>
    {children}
  </div>
);

export function SearchForm({ onSearch }: SearchFormProps) {
  // Gunakan custom hook
  const { formState, setFieldValue, handleSearch, handleReset } = useSearchForm(onSearch);
  const { destination, checkIn, checkOut, guests } = formState;

  return (
    <div className="bg-white shadow-lg -mt-20 relative z-10 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <SearchField label="Destination" icon={<MapPin className="inline h-4 w-4 mr-1" />} className="lg:col-span-2">
          <DestinationSelect value={destination} onChange={(val) => setFieldValue('destination', val)} />
        </SearchField>

        <SearchField label="Check-in" icon={<CalendarIcon className="inline h-4 w-4 mr-1" />}>
          <DatePicker
            selected={checkIn}
            onSelect={(date) => setFieldValue('checkIn', date)}
            placeholder="Select date"
            disabled={(date) => date < new Date()}
          />
        </SearchField>

        <SearchField label="Check-out" icon={<CalendarIcon className="inline h-4 w-4 mr-1" />}>
          <DatePicker
            selected={checkOut}
            onSelect={(date) => setFieldValue('checkOut', date)}
            placeholder="Select date"
            disabled={(date) => date < (checkIn || new Date())}
          />
        </SearchField>

        <SearchField label="Guests" icon={<Users className="inline h-4 w-4 mr-1" />}>
          <GuestSelect value={guests} onChange={(val) => setFieldValue('guests', val)} />
        </SearchField>

      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={handleSearch} size="lg" className="px-12">
          Search Properties
        </Button>
        <Button onClick={handleReset} size="lg" variant="outline" className="px-12">
          Reset
        </Button>
      </div>
    </div>
  );
}