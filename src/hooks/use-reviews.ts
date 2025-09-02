import apiHelper from '@/lib/apiHelper';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';


// Definisikan tipe data untuk ulasan sesuai dengan backend Anda
export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        avatarUrl?: string;
    };
    reply?: {
        comment: string;
        createdAt: string;
    };
}

export interface OrderForReview {
    id: string;
    property: {
        id: string;
        name: string;
        images: { url: string }[];
    };
    checkInDate: string;
    checkOutDate: string;
    review: Review | null;
}

export const useReviews = () => {
    const [orders, setOrders] = useState<OrderForReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mengambil daftar pesanan yang bisa diulas oleh pengguna
    const fetchOrdersForReview = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Endpoint ini perlu disesuaikan jika berbeda di backend Anda
            // Asumsinya, endpoint ini mengembalikan pesanan yang sudah selesai (completed)
            const response = await apiHelper.get('/orders/completed-for-review');
            setOrders(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Gagal memuat data pesanan.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Mengirim ulasan baru
    const submitReview = async (
        orderId: string,
        propertyId: string,
        rating: number,
        comment: string,
    ) => {
        try {
            const response = await apiHelper.post('/reviews', {
                orderId,
                propertyId,
                rating,
                comment,
            });
            toast.success('Ulasan berhasil dikirim!');
            // Refresh data setelah ulasan dikirim
            fetchOrdersForReview();
            return response.data;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Gagal mengirim ulasan. Anda mungkin sudah pernah memberikan ulasan untuk pesanan ini.';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        fetchOrdersForReview();
    }, []);

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

    useEffect(() => {
        if (!propertyId) return;

        const fetchReviews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiHelper.get(`/reviews/property/${propertyId}`);
                setReviews(response.data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Gagal memuat ulasan.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [propertyId]);

    return { reviews, isLoading, error };
}