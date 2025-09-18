'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserOrder } from "@/lib/types";
import OrderCard from "./OrderCard"; 

interface OrderListProps {
    orders: UserOrder[];
    onCancel: (invoice: string) => void;
    onComplete: (id: string) => void;
    onActionSuccess: () => void;
}

const TABS = [
    { value: "semua", label: "Semua" },
    { value: "MENUNGGU_PEMBAYARAN", label: "Menunggu Bayar" },
    { value: "MENUNGGU_KONFIRMASI", label: "Menunggu Konfirmasi" },
    { value: "DIPROSES", label: "Di Proses" },
    { value: "SELESAI", label: "Selesai" },
    { value: "DIBATALKAN", label: "Di Batalkan" },
];

export default function OrderList({ orders, onCancel, onComplete, onActionSuccess }: OrderListProps) {
    const filterOrdersByStatus = (status: string) => {
        if (status === 'semua') return orders;
        return orders.filter(order => order.status === status);
    };

    return (
        <Tabs defaultValue="semua" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                {TABS.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
            </TabsList>

            {TABS.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="space-y-4 mt-4">
                    {filterOrdersByStatus(tab.value).length > 0 ? (
                        filterOrdersByStatus(tab.value).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={onCancel}
                                onComplete={onComplete}
                                onUploadSuccess={onActionSuccess}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Tidak ada pesanan dengan status ini.</p>
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
}