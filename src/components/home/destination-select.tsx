"use client"

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import apiHelper from "@/lib/apiHelper";

interface City {
    id: string;
    name: string;
}

interface DestinationSelectProps {
  value: string
  onChange: (value: string) => void
}

export function DestinationSelect({ value, onChange }: DestinationSelectProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await apiHelper.get('/cities');
        setCities(response.data.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        // Tetap tampilkan dropdown kosong jika gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Memuat kota..." : "Pilih kota destinasi"} />
      </SelectTrigger>
      <SelectContent>
        {!isLoading && cities.map((city) => (
          <SelectItem key={city.id} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}