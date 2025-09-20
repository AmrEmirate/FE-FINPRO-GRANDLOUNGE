import type { PaginatedResponse, Property } from "@/lib/types";
import { notFound } from 'next/navigation';

// INTERFACE UNTUK RESPON DENGAN PAGINASI (SUDAH ADA DI TIPE GLOBAL)
// (Tidak perlu ditambahkan jika sudah ada di @/lib/types)
/*
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
*/

interface PropertyDetailResponse {
    data: Property;
}

// FUNGSI UNTUK MENGAMBIL SEMUA PROPERTI (DENGAN FILTER)
export const getProperties = async (params?: any): Promise<PaginatedResponse<Property>> => {
    // Membuat query string dari searchParams
    const searchParams = new URLSearchParams(params);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties?${searchParams.toString()}`;

    try {
        const res = await fetch(apiUrl, {
            // Nonaktifkan cache agar data filter selalu terbaru
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch properties: ${res.statusText}`);
        }

        return res.json();

    } catch (error) {
        console.error('Error fetching properties:', error);
        // Mengembalikan struktur data kosong jika terjadi error agar halaman tidak crash
        return {
            data: [],
            meta: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
            },
        };
    }
};

// FUNGSI UNTUK MENGAMBIL PROPERTI BERDASARKAN ID (TIDAK DIUBAH)
export async function getPropertyById(id: string): Promise<Property> {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${id}`;

    try {
        const res = await fetch(apiUrl, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            if (res.status === 404) {
                notFound();
            }
            throw new Error(`Failed to fetch property details: ${res.statusText}`);
        }

        const result: PropertyDetailResponse = await res.json();
        return result.data;

    } catch (error) {
        console.error(`Error fetching property by ID (${id}):`, error);
        // Jika ada error lain, tampilkan juga halaman not-found
        notFound();
    }
}