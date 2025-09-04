'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/utils/api';

// --- PERBAIKAN UTAMA DI SINI ---
// Definisikan tipe data untuk ulasan agar sesuai dengan backend dan review-card.tsx
export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        fullName: string;           // Ubah dari name
        profilePicture?: string;    // Ubah dari avatarUrl
    };
    reply?: {
        comment: string;
        createdAt: string;
    };
}
// --- AKHIR DARI PERBAIKAN ---

// Definisikan tipe data untuk pesanan
export interface OrderForReview {
    id: string; // Ini adalah ID booking
    property: {
        id: string;
        name: string;
        images: { url: string }[];
    };
    checkIn: string;
    checkOut: string;

    review: Review | null;
    status: string;
}

// Hook untuk mengelola ulasan dari sisi pengguna
export const useReviews = () => {
    const [orders, setOrders] = useState<OrderForReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrdersForReview = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<{ data: OrderForReview[] }>('/orders/order-list');
            const completedOrders = response.data.data.filter(
                (order: any) => order.status === 'SELESAI'
            );
            setOrders(completedOrders);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data pesanan.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const submitReview = async (
        bookingId: string,
        propertyId: string,
        rating: number,
        comment: string
    ) => {
        try {
            const response = await api.post('/reviews', {
                bookingId,
                propertyId,
                rating,
                comment,
            });
            toast.success('Ulasan berhasil dikirim!');
            await fetchOrdersForReview();
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal mengirim ulasan.';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        fetchOrdersForReview();
    }, [fetchOrdersForReview]);

    return {
        orders,
        isLoading,
        error,
        submitReview,
        refetch: fetchOrdersForReview,
    };
};

// Hook untuk mengambil ulasan publik berdasarkan ID properti
export const usePublicReviews = (propertyId: string) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!propertyId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<Review[]>(`/reviews/property/${propertyId}`);
            setReviews(response.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat ulasan.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return { reviews, isLoading, error, refetch: fetchReviews };
};