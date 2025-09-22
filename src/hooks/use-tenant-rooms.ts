import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { Room } from '@/lib/types';

const fetchTenantRooms = async (propertyId: string) => {
  const { data } = await api.get(`/properties/my-properties/${propertyId}/rooms`);
  return data.data;
};

export const useTenantRooms = (propertyId: string | null) => {
  const { data, ...rest } = useQuery<Room[]>({
    queryKey: ['tenant-rooms', propertyId],

    queryFn: () => fetchTenantRooms(propertyId!),

    enabled: !!propertyId,
  });

  return { rooms: data, ...rest };
};