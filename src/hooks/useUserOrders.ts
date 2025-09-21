import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { UserOrder } from '@/lib/types';

export function useUserOrders() {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // State untuk semua filter
    const [searchFilter, setSearchFilter] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('');
    const [dateFilter, setDateFilter] = useState<Date | undefined>();

    const formatDateForAPI = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchFilter) params.append('searchQuery', searchFilter);
            if (propertyFilter) params.append('propertyName', propertyFilter);
            if (dateFilter) params.append('checkIn', formatDateForAPI(dateFilter));
            
            const response = await api.get(`/orders/order-list?${params.toString()}`);
            setOrders(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar pesanan.' });
        } finally {
            setIsLoading(false);
        }
    }, [searchFilter, propertyFilter, dateFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleResetFilters = () => {
        setSearchFilter('');
        setPropertyFilter('');
        setDateFilter(undefined);
    };

    return {
        orders,
        isLoading,
        filters: {
            search: searchFilter,
            property: propertyFilter,
            date: dateFilter,
        },
        setFilters: {
            setSearch: setSearchFilter,
            setProperty: setPropertyFilter,
            setDate: setDateFilter,
        },
        fetchOrders,
        handleResetFilters,
    };
}