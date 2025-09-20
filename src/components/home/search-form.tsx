"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { DestinationSelect } from "./destination-select";
import { DatePicker } from "./date-picker";
import { GuestSelect } from "./guest-select";
import { useSearchForm, SearchFormState } from "@/hooks/use-search-form";
import type React from "react";

export type { SearchFormState as SearchQuery };

interface SearchFormProps {
  onSearch: (query: SearchFormState | null) => void;
}

const SearchField: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> =
  ({ label, icon, children, className = "" }) => (
    <div className={className}>
      <Label className="text-sm font-medium text-white mb-2 block">
        {icon} {label}
      </Label>
      {children}
    </div>
  );

export function SearchForm({ onSearch }: SearchFormProps) {
  const { formState, setFieldValue, handleSearch, handleReset } = useSearchForm(onSearch);
  const { destination, checkIn, checkOut, guests } = formState;

  return (
    <div className="bg-gray-900/90 shadow-lg -mt-20 relative z-10 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl rounded-3xl p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2.5fr_1fr_auto] gap-x-6 gap-y-4 items-end">

        <SearchField label="Destination" icon={<MapPin className="inline h-4 w-4 mr-1 text-white/70" />}>
          <DestinationSelect
            value={destination}
            onChange={(val) => setFieldValue('destination', val)}
            className="bg-transparent hover:bg-white/10 text-white font-bold text-lg border-none"
          />
        </SearchField>

        <div>
          <Label className="text-sm font-medium text-white mb-2 block">
            <CalendarIcon className="inline h-4 w-4 mr-1" /> Dates
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              selected={checkIn}
              onSelect={(date) => setFieldValue('checkIn', date)}
              placeholder="Check-in"
              disabled={(date) => date < new Date()}
            />
            <DatePicker
              selected={checkOut}
              onSelect={(date) => setFieldValue('checkOut', date)}
              placeholder="Check-out"
              disabled={(date) => date < (checkIn || new Date())}
            />
          </div>
        </div>

        <SearchField label="Guests" icon={<Users className="inline h-4 w-4 mr-1" />}>
          <GuestSelect
            value={guests}
            onChange={(val) => setFieldValue('guests', val)}
            className="bg-transparent hover:bg-white/10 text-white font-bold text-lg border-none"
          />
        </SearchField>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button onClick={handleSearch} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-lg flex-grow px-8">
            Search
          </Button>
          <Button className="bg-red-500 text-white hover:bg-red-300 hover:text-black" onClick={handleReset} size="lg" aria-label="Reset form">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}