import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { UserOrder, Property } from '@/lib/types'; // Asumsi tipe UserOrder bisa dipakai

export function useTenantTransactions() {
    const [transactions, setTransactions] = useState<UserOrder[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // State untuk semua filter
    const [searchFilter, setSearchFilter] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('');
    const [dateFilter, setDateFilter] = useState<Date | undefined>();
    const [statusFilter, setStatusFilter] = useState('');

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchFilter) params.append('searchQuery', searchFilter);
            if (propertyFilter) params.append('propertyId', propertyFilter);
            if (statusFilter) params.append('status', statusFilter);
            if (dateFilter) params.append('checkIn', dateFilter.toISOString().split('T')[0]);

            const response = await api.get(`/orders/tenant-transactions?${params.toString()}`);
            setTransactions(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar transaksi.' });
        } finally {
            setIsLoading(false);
        }
    }, [searchFilter, propertyFilter, dateFilter, statusFilter, toast]);

    const fetchTenantProperties = async () => {
        try {
            const response = await api.get('/properties/tenant');
            setProperties(response.data.data || []);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar properti.' });
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        fetchTenantProperties();
    }, []);

    const handleResetFilters = () => {
        setSearchFilter('');
        setPropertyFilter('');
        setDateFilter(undefined);
        setStatusFilter('');
    };

    return {
        transactions,
        isLoading,
        properties,
        filters: {
            search: searchFilter,
            property: propertyFilter,
            date: dateFilter,
            status: statusFilter
        },
        setFilters: {
            setSearch: setSearchFilter,
            setProperty: setPropertyFilter,
            setDate: setDateFilter,
            setStatus: setStatusFilter,
        },
        refetch: fetchTransactions,
        handleResetFilters,
    };
}