import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import api from '@/utils/api';
import { Room } from '@/lib/types';
import { PeakSeason } from '@/components/tenant/PeakSeasonDialog';

export interface Availability {
  date: string;
  status: 'AVAILABLE' | 'BOOKED' | 'PENDING' | 'UNAVAILABLE';
  price?: number;
}

const fetchRoomAvailabilityReport = async (propertyId: string, roomId: string, month: Date): Promise<Availability[]> => {
  const startDate = startOfMonth(month);
  const endDate = endOfMonth(month);

  const params = {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };

  const response = await api.get(`/reports/availability/${propertyId}/${roomId}`, { params });

  const availabilityData = response.data.data;
  return Object.entries(availabilityData).map(([date, data]: [string, any]) => ({
    date,
    status: data.status,
    price: data.price,
  }));
};

const fetchRoomDetails = async (propertyId: string, roomId: string) => {
  const roomPromise = api.get(`/properties/my-properties/${propertyId}/rooms/${roomId}`);

  const peakSeasonsPromise = api.get(`/peak-seasons/by-room/${roomId}`);
  
  const [roomRes, peakSeasonsRes] = await Promise.all([roomPromise, peakSeasonsPromise]);
  return {
    room: roomRes.data.data as Room,
    peakSeasons: peakSeasonsRes.data as PeakSeason[],
  };
};

export const useRoomAvailability = (propertyId: string, roomId: string, month: Date) => {
  const { data: detailsData, isLoading: isLoadingDetails, error: detailsError } = useQuery({
    queryKey: ['roomDetails', propertyId, roomId],
    queryFn: () => fetchRoomDetails(propertyId, roomId),
    enabled: !!propertyId && !!roomId,
  });

  const { data: availabilityData, isLoading: isLoadingAvailability, error: availabilityError, refetch } = useQuery({
    queryKey: ['roomAvailabilityReport', propertyId, roomId, format(month, 'yyyy-MM')],
    queryFn: () => fetchRoomAvailabilityReport(propertyId, roomId, month),
    enabled: !!propertyId && !!roomId,
  });

  return {
    room: detailsData?.room,
    availability: availabilityData || [], 
    peakSeasons: detailsData?.peakSeasons || [],
    isLoading: isLoadingDetails || isLoadingAvailability,
    error: detailsError || availabilityError,
    refetch,
  };
};