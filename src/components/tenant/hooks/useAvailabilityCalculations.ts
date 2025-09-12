// components/tenant/hooks/useAvailabilityCalculations.ts
import { useMemo } from 'react';
import { format, isWithinInterval } from 'date-fns';
import type { PeakSeason } from "../PeakSeasonDialog";

// Tipe data untuk ketersediaan
interface Availability {
  date: string;
  isAvailable: boolean;
  price?: number;
}

export function useAvailabilityCalculations(availabilityData: Availability[], peakSeasons: PeakSeason[], basePrice: number) {
  const availabilityMap = useMemo(() => new Map(
    availabilityData.map(a => [a.date.split("T")[0], a])
  ), [availabilityData]);

  const applyPeakSeason = (date: Date) => {
    let currentPrice = basePrice;
    for (const season of peakSeasons) {
      if (isWithinInterval(date, { start: season.startDate, end: season.endDate })) {
        if (season.adjustmentType === "NOMINAL") currentPrice += season.adjustmentValue;
        else currentPrice *= 1 + season.adjustmentValue / 100;
        break;
      }
    }
    return currentPrice;
  };

  const calculateFinalPrice = (date: Date): number | null => {
    const key = format(date, "yyyy-MM-dd");
    const availability = availabilityMap.get(key);
    if (availability && !availability.isAvailable) return null;

    const seasonalPrice = applyPeakSeason(date);
    return availability?.price && availability.price > 0 ? availability.price : seasonalPrice;
  };

  return { availabilityMap, calculateFinalPrice, applyPeakSeason };
}