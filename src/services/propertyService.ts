import type { Property } from "@/lib/types";
import { notFound } from 'next/navigation';

interface PropertyDetailResponse {
    data: Property;
}

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