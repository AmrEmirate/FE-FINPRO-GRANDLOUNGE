import type { Property } from "@/lib/types";
import { notFound } from 'next/navigation';

interface PaginatedPropertiesResponse {
    data: Property[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface PropertyDetailResponse {
    data: Property;
}
export async function getProperties(searchParams: { [key: string]: any }): Promise<PaginatedPropertiesResponse> {
    const params = new URLSearchParams(searchParams);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties?${params.toString()}`;

    try {
        const res = await fetch(apiUrl, { cache: 'no-store' }); // no-store agar filter selalu terbaru
        if (!res.ok) {
            throw new Error(`Failed to fetch properties: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error fetching properties:", error);
        return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
    }
}

export async function getPropertyById(id: string): Promise<Property> {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${id}`;

    try {
        const res = await fetch(apiUrl, {
            next: { revalidate: 60 } // Cache data selama 60 detik
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
        notFound();
    }
}