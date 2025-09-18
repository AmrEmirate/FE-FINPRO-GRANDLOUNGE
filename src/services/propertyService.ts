// src/services/propertyService.ts

import type { Property } from "@/lib/types";

// Definisikan tipe respons agar bisa digunakan kembali
interface PaginatedPropertiesResponse {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fungsi helper untuk membangun parameter URL
function buildSearchParams(params: { [key: string]: any }): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      // Ganti 'q' dengan 'search' sesuai logika Anda
      const paramKey = key === 'q' ? 'search' : key;
      searchParams.append(paramKey, String(value));
    }
  });

  if (!searchParams.has('page')) {
    searchParams.append('page', '1');
  }

  return searchParams;
}

// Fungsi utama untuk mengambil data, sekarang lebih ringkas
export async function getProperties(searchParams: { [key: string]: any }): Promise<PaginatedPropertiesResponse> {
  const params = buildSearchParams(searchParams);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties?${params.toString()}`;

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      // Lemparkan error agar bisa ditangani di level yang lebih tinggi jika perlu
      throw new Error(`Failed to fetch properties: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    // Di dunia nyata, ini akan dicatat oleh layanan logging (bukan console.error)
    console.error("Error fetching properties:", error); 
    // Kembalikan nilai default jika terjadi error
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}