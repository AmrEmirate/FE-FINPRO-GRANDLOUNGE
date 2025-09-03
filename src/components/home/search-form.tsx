// src/components/home/search-form.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { DestinationSelect } from "./destination-select";
import { DatePicker } from "./date-picker";
import { GuestSelect } from "./guest-select";

// Ekspor tipe data query agar bisa digunakan di page.tsx
export interface SearchQuery {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: string;
}

// Tambahkan props onSearch
interface SearchFormProps {
  onSearch: (query: SearchQuery | null) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) {
      alert("Please fill in all required fields");
      return;
    }

    // Panggil fungsi onSearch dari props dengan data form
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };
  
  // Fungsi baru untuk mereset filter
  const handleReset = () => {
      setDestination("");
      setCheckIn(undefined);
      setCheckOut(undefined);
      setGuests("1");
      onSearch(null); // Kirim null untuk menampilkan semua properti lagi
  }

  return (
    <div className="bg-white shadow-lg -mt-20 relative z-10 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 block">
            <MapPin className="inline h-4 w-4 mr-1" />
            Destination
          </Label>
          <DestinationSelect value={destination} onChange={setDestination} />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Check-in
          </Label>
          <DatePicker
            selected={checkIn}
            onSelect={setCheckIn}
            placeholder="Select date"
            disabled={(date) => date < new Date()}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Check-out
          </Label>
          <DatePicker
            selected={checkOut}
            onSelect={setCheckOut}
            placeholder="Select date"
            disabled={(date) => date < (checkIn || new Date())}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            <Users className="inline h-4 w-4 mr-1" />
            Guests
          </Label>
          <GuestSelect value={guests} onChange={setGuests} />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={handleSearch} size="lg" className="px-12">
          Search Properties
        </Button>
        {/* Tambahkan tombol Reset */}
        <Button onClick={handleReset} size="lg" variant="outline" className="px-12">
          Reset
        </Button>
      </div>
    </div>
  );
}