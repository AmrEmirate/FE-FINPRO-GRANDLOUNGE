import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { UserOrder } from '@/lib/types';

// Custom hook untuk mengelola semua logika terkait order
export function useUserOrders() {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = useCallback(async (filters: { orderId?: string; date?: string } = {}) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.orderId) {
                params.append('orderId', filters.orderId);
            }
            if (filters.date) {
                params.append('date', filters.date);
            }

            const response = await api.get(`/orders/order-list?${params.toString()}`);

            if (Array.isArray(response.data.data)) {
                setOrders(response.data.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar pesanan.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    return { orders, isLoading, fetchOrders };
}

// Custom hook untuk debouncing
export function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}