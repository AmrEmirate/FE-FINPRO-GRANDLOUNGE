import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CheckCircle, Clock, Home } from 'lucide-react';

interface BusinessSnapshotProps {
    totalRevenue: number;
    completedTransactions: number;
    pendingTransactions: number;
    topProperty: string;
}

export const TransactionBusinessSnapshot = ({
    totalRevenue,
    completedTransactions,
    pendingTransactions,
    topProperty,
}: BusinessSnapshotProps) => {
    return (
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className='bg-gray-900 text-white'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground text-white" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                        }).format(totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground text-white">Dari transaksi yang telah selesai</p>
                </CardContent>
            </Card>
            <Card className='bg-gray-900 text-white'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transaksi Selesai</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground text-white" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{completedTransactions}</div>
                    <p className="text-xs text-muted-foreground text-white">Total booking yang sukses</p>
                </CardContent>
            </Card>
            <Card className='bg-gray-900 text-white'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Menunggu Konfirmasi</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground text-white" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{pendingTransactions}</div>
                    <p className="text-xs text-muted-foreground text-white">Transaksi perlu tindakan Anda</p>
                </CardContent>
            </Card>
            <Card className='bg-gray-900 text-white'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Properti Terlaris</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground text-white" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold truncate">{topProperty}</div>
                    <p className="text-xs text-muted-foreground text-white">Properti dengan booking terbanyak</p>
                </CardContent>
            </Card>
        </div>
    );
};