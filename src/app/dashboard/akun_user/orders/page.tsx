'use client';

import { useUserOrders } from '@/hooks/useUserOrders';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderList from '@/components/orders/OrderList';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

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
    

    // Handler untuk aksi-aksi sekarang berada di sini, tapi logikanya dipanggil dari hook
    const handleCancelOrder = async (invoice: string) => {
        try {
            await api.patch(`/order-cancel/user/cancel/invoice/${invoice}`);
            toast({ title: 'Berhasil', description: 'Pesanan Anda telah berhasil dibatalkan.' });
            fetchOrders();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Gagal membatalkan pesanan.';
            toast({ variant: 'destructive', title: 'Gagal', description: errorMessage });
        }
    };

    const handleCompleteOrder = async (id: string) => {
        try {
            await api.patch(`/orders/complete/${id}`);
            toast({ title: 'Berhasil', description: 'Pesanan telah ditandai sebagai selesai.' });
            fetchOrders(); 
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Gagal menyelesaikan pesanan.';
            toast({ variant: 'destructive', title: 'Gagal', description: errorMessage });
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