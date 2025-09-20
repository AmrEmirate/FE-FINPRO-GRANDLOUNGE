import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { UseQueryResult } from '@tanstack/react-query'; // Import UseQueryResult for explicit typing

// Definisikan tipe data yang kita harapkan dari endpoint agregasi di backend
interface AggregatedData {
    status: 'FULLY_AVAILABLE' | 'PARTIALLY_AVAILABLE' | 'FULLY_BOOKED';
    availableCount: number;
    totalRooms: number;
}

// Tipe untuk data yang akan dikembalikan oleh useQuery
type AvailabilityRecord = Record<string, AggregatedData>;

// Fungsi async yang melakukan panggilan API sesungguhnya
const fetchPropertyAvailability = async (propertyId: string, month: Date): Promise<AvailabilityRecord> => {
    // Logika perhitungan tanggal dipindahkan ke sini
    const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(month), 'yyyy-MM-dd');

    const { data } = await api.get(`/calendar-report/property/${propertyId}`, {
        params: { startDate, endDate },
    });
    // Pastikan Anda mengembalikan properti `data` dari respons API Anda
    return data.data || {};
};

// Custom Hook yang sudah diperbaiki
export const usePropertyAvailability = (
    propertyId: string,
    month: Date
): UseQueryResult<AvailabilityRecord, Error> => {
    return useQuery({
        // Kunci query sekarang lebih sederhana
        queryKey: ['propertyAvailability', propertyId, format(month, 'yyyy-MM')],

        // Memanggil fungsi fetch dengan argumen yang benar
        queryFn: () => fetchPropertyAvailability(propertyId, month),

        // Hanya jalankan jika propertyId ada
        enabled: !!propertyId,

        // Placeholder data agar UI tidak berkedip saat berpindah bulan
        placeholderData: (previousData) => previousData,
        // retry: false, // Opsional: nonaktifkan coba ulang jika gagal
    });
};