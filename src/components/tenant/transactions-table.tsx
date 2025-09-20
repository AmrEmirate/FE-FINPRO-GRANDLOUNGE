'use client';

import { useState, useMemo } from 'react';
import { useTenantTransactions, TenantTransaction, TransactionStatus, TransactionFiltersState } from '@/hooks/useTenantTransactions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import api from '@/utils/api';
import { toast } from 'sonner';
import { format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { Eye, Check, X, Clock, User, CalendarDays, Wallet, Building, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { TransactionFilters } from './TransactionFilters';
import { useTenantTransactionAnalytics } from '@/hooks/useTenantTransactionAnalytics';
import { TransactionBusinessSnapshot } from './TransactionBusinessSnapshot';

const statusConfig = {
    MENUNGGU_PEMBAYARAN: { text: 'Menunggu Pembayaran', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
    MENUNGGU_KONFIRMASI: { text: 'Menunggu Konfirmasi', variant: 'default' as const, icon: Clock, color: 'text-blue-600' },
    DIPROSES: { text: 'Diproses', variant: 'default' as const, icon: Building, color: 'text-indigo-600' },
    SELESAI: { text: 'Selesai', variant: 'success' as const, icon: CheckCircle, color: 'text-green-600' },
    DIBATALKAN: { text: 'Dibatalkan', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
};

export const TransactionsContent = () => {
    const [filterInputs, setFilterInputs] = useState({
        searchQuery: '',
        checkInDate: undefined as Date | undefined,
    });
    const [activeFilters, setActiveFilters] = useState<TransactionFiltersState>({
        status: 'Semua',
        searchQuery: '',
        checkInDate: undefined,
    });
    const { transactions: allTransactions, isLoading, refetch } = useTenantTransactions(activeFilters.status);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    const filteredTransactions = useMemo(() => {
        return allTransactions.filter(trx => {
            const query = activeFilters.searchQuery.toLowerCase();
            const matchesQuery = !query ||
                trx.user?.fullName?.toLowerCase().includes(query) ||
                trx.property?.name?.toLowerCase().includes(query) ||
                trx.reservationId?.toLowerCase().includes(query) ||
                trx.invoiceNumber?.toLowerCase().includes(query);
            const matchesDate = !activeFilters.checkInDate ||
                isSameDay(new Date(trx.checkIn), activeFilters.checkInDate);
            return matchesQuery && matchesDate;
        });
    }, [allTransactions, activeFilters]);

    const analyticsData = useTenantTransactionAnalytics(filteredTransactions);

    const handleAction = async (invoiceNumber: string, isAccepted: boolean) => {
        const action = isAccepted ? 'menyetujui' : 'menolak';
        const toastId = toast.loading(`Sedang ${action} pembayaran...`);
        try {
            await api.patch(`/payment-confirm/confirm/${invoiceNumber}`, { isAccepted });
            toast.success(`Pembayaran berhasil ${isAccepted ? 'disetujui' : 'ditolak'}.`, { id: toastId });
            refetch();
        } catch (error: any) {
            toast.error(`Gagal ${action} pembayaran`, {
                id: toastId,
                description: error.response?.data?.message || 'Terjadi kesalahan.',
            });
        }
    };

    // Fungsi pembantu untuk merender tombol aksi
    const renderActionButton = (label: string, icon: React.ReactNode, isAccepted: boolean, variant: 'default' | 'destructive' | 'outline', invoiceNumber: string) => (
        <AlertDialog key={label}>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant={variant} className={isAccepted ? 'bg-green-600 hover:bg-green-700' : ''}>
                    {icon} {label}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Konfirmasi {label}</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>Yakin ingin <strong>{label.toLowerCase()}</strong> pembayaran ini?</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => handleAction(invoiceNumber, isAccepted)} className={isAccepted ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>Ya, {label}</AlertDialogAction>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    // Fungsi pembantu untuk merender kartu transaksi
    const renderTransactionCard = (trx: TenantTransaction) => {
        const statusInfo = statusConfig[trx.status] || { text: trx.status.replace(/_/g, ' '), variant: 'outline' as const, icon: AlertCircle, color: 'text-gray-600' };
        const Icon = statusInfo.icon;

        return (
            <Card key={trx.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 relative h-48 md:h-auto flex-shrink-0">
                        <Image src={trx.property?.mainImage || '/placeholder.jpg'} alt={trx.property?.name || 'Property Image'} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <CardHeader className="flex-row items-start justify-between gap-4 pb-3">
                            <div>
                                <CardTitle className="text-lg mb-1">{trx.property.name}</CardTitle>
                                <CardDescription className="font-bold">No. Pesanan: {trx.reservationId?.substring(0, 6).toUpperCase() ?? 'N/A'}</CardDescription>
                                <CardDescription>{trx.invoiceNumber}</CardDescription>
                            </div>
                            <Badge variant={statusInfo.variant} className="flex-shrink-0 whitespace-nowrap">
                                <Icon className={`h-3 w-3 mr-1.5 ${statusInfo.color}`} />
                                {statusInfo.text}
                            </Badge>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4 px-6 pb-4">
                            <Separator />
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                                <div className="flex items-center gap-2 col-span-full">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div><p className="font-semibold">Nama Pemesan</p><p className="text-gray-600">{trx.user?.fullName || 'Tidak ada nama'}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                    <div><p className="font-semibold">Check-in</p><p className="text-gray-600">{format(new Date(trx.checkIn), 'd MMM yyyy', { locale: id })}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                    <div><p className="font-semibold">Check-out</p><p className="text-gray-600">{format(new Date(trx.checkOut), 'd MMM yyyy', { locale: id })}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-gray-500" />
                                    <div><p className="font-semibold">Total Harga</p><p className="text-gray-600 font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.totalPrice)}</p></div>
                                </div>
                            </div>
                        </CardContent>
                        {trx.status === 'MENUNGGU_KONFIRMASI' && (
                            <CardFooter className="bg-gray-50/50 px-6 py-3 flex justify-end items-center w-full gap-2">
                                <Button variant="outline" size="sm" onClick={() => trx.paymentProof && setSelectedProof(trx.paymentProof)} disabled={!trx.paymentProof}>
                                    <Eye className="h-4 w-4 mr-2" /> Lihat Bukti
                                </Button>
                                {renderActionButton('Setuju', <Check className="h-4 w-4 mr-2" />, true, 'default', trx.invoiceNumber)}
                                {renderActionButton('Tolak', <X className="h-4 w-4 mr-2" />, false, 'destructive', trx.invoiceNumber)}
                            </CardFooter>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <>
            <TransactionBusinessSnapshot {...analyticsData} />
            <TransactionFilters
                searchQuery={filterInputs.searchQuery}
                setSearchQuery={(value) => setFilterInputs(prev => ({ ...prev, searchQuery: value }))}
                checkInDate={filterInputs.checkInDate}
                setCheckInDate={(date) => setFilterInputs(prev => ({ ...prev, checkInDate: date }))}
                onSearch={() => setActiveFilters(prev => ({ ...prev, ...filterInputs }))}
                onReset={() => {
                    const resetState = { searchQuery: '', checkInDate: undefined };
                    setFilterInputs(resetState);
                    setActiveFilters(prev => ({ ...prev, ...resetState }));
                }}
            />
            <Tabs value={activeFilters.status} onValueChange={(value) => setActiveFilters(prev => ({ ...prev, status: value as TransactionStatus }))}>
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                    <TabsTrigger value="Semua">Semua</TabsTrigger>
                    <TabsTrigger value="MENUNGGU_PEMBAYARAN">Menunggu Bayar</TabsTrigger>
                    <TabsTrigger value="MENUNGGU_KONFIRMASI">Konfirmasi</TabsTrigger>
                    <TabsTrigger value="DIPROSES">Diproses</TabsTrigger>
                    <TabsTrigger value="SELESAI">Selesai</TabsTrigger>
                    <TabsTrigger value="DIBATALKAN">Dibatalkan</TabsTrigger>
                </TabsList>
            </Tabs>
            {isLoading ? (
                <div className="space-y-4 mt-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>
            ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">Tidak Ada Transaksi</h3>
                    <p className="text-gray-500 mt-2">Coba ubah filter atau reset pencarian Anda.</p>
                </div>
            ) : (
                <div className="space-y-6 mt-6">{filteredTransactions.map(renderTransactionCard)}</div>
            )}
            <Dialog open={!!selectedProof} onOpenChange={(isOpen) => !isOpen && setSelectedProof(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Bukti Pembayaran</DialogTitle></DialogHeader>
                    {selectedProof && <Image src={selectedProof} alt="Bukti Pembayaran" width={600} height={800} className="rounded-md w-full h-auto" />}
                    <DialogClose asChild><Button type="button" variant="secondary" className="mt-4 w-full">Tutup</Button></DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
};