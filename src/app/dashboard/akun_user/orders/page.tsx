'use client';

import { useUserOrders } from '@/hooks/useUserOrders';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderList from '@/components/orders/OrderList';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

function OrdersContent() {
    const { toast } = useToast();
    const {
        orders,
        isLoading,
        filters,
        setFilters,
        fetchOrders,
        handleResetFilters,
    } = useUserOrders();
    
    const [completingId, setCompletingId] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancelOrder = async (invoice: string) => {
        setCancellingId(invoice);
        try {
            await api.patch(`/order-cancel/user/cancel/invoice/${invoice}`);
            toast({ title: 'Berhasil', description: 'Pesanan Anda telah berhasil dibatalkan.' });
            fetchOrders();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Gagal membatalkan pesanan.';
            toast({ variant: 'destructive', title: 'Gagal', description: errorMessage });
        } finally {
            setCancellingId(null); 
        }
    };

    const handleCompleteOrder = async (bookingId: string) => {
        setCompletingId(bookingId);
        try {
            await api.patch(`/orders/${bookingId}/complete`); 
            toast({ title: 'Berhasil', description: 'Pesanan telah ditandai sebagai selesai.' });
            fetchOrders(); 
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Gagal menyelesaikan pesanan.';
            toast({ variant: 'destructive', title: 'Gagal', description: errorMessage });
        } finally {
            setCompletingId(null); 
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Riwayat Pesanan Saya</h1>
                <p className="text-gray-500">Lihat dan kelola semua riwayat pesanan Anda di sini.</p>
            </div>

            <OrderFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={fetchOrders}
                onReset={handleResetFilters}
            />

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            ) : (
                <OrderList
                    orders={orders}
                    onCancel={handleCancelOrder}
                    onComplete={handleCompleteOrder}
                    onActionSuccess={fetchOrders}
                    completingId={completingId}
                    cancellingId={cancellingId}
                />
            )}
        </div>
    );
}

export default function UserOrdersPage() {
    return (
        <ProtectedRoute role="USER">
            <OrdersContent />
        </ProtectedRoute>
    );
}