'use client';

import { UserOrder } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Wallet } from "lucide-react";
import UploadPaymentDialog from "./upload-payment-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import WriteReviewDialog from "./WriteReviewDialog";
import { CountdownTimer } from "../bookings/CountdownTimer";
import { Loader2 } from 'lucide-react';

interface OrderCardProps {
    order: UserOrder,
    onCancel: (invoice: string) => void,
    onComplete: (id: string) => void,
    onUploadSuccess: () => void
    completingId: string | null;
    cancellingId: string | null;
}

export default function OrderCard({ order, onCancel, onComplete, onUploadSuccess, completingId, cancellingId }: OrderCardProps) {
    const canReview = new Date() >= new Date(order.checkOut);

    const isCompleting = completingId === order.id;
    const isCancelling = cancellingId === order.invoiceNumber;

    const getStatusVariant = (status: UserOrder['status']) => {
        switch (status) {
            case 'SELESAI': return 'success';
            case 'DIPROSES': return 'default';
            case 'MENUNGGU_PEMBAYARAN':
            case 'MENUNGGU_KONFIRMASI':
                return 'secondary';
            case 'DIBATALKAN': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-40 flex-shrink-0 relative">
                    <Image src={order.property.mainImage || '/placeholder.jpg'} alt={order.property.name} layout="fill" className="rounded-md object-cover" />
                </div>
                <div className="flex-grow space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{order.property.name}</h3>
                            {order.reservationId && (
                                <p className="text-sm font-semibold text-gray-700">
                                    No. Pesanan: {order.reservationId.substring(0, 6).toUpperCase()}
                                </p>
                            )}

                            <p className="text-xs text-gray-500">
                                {order.invoiceNumber}
                            </p>
                        </div>
                        <Badge variant={getStatusVariant(order.status)}>{order.status.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" /><div><p className="font-semibold">Check-in</p><p>{format(new Date(order.checkIn), 'dd MMM yyyy', { locale: id })}</p></div></div>
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" /><div><p className="font-semibold">Check-out</p><p>{format(new Date(order.checkOut), 'dd MMM yyyy', { locale: id })}</p></div></div>
                        <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-gray-500" /><div><p className="font-semibold">Total Bayar</p><p>Rp {order.totalPrice.toLocaleString('id-ID')}</p></div></div>
                    </div>
                    {order.status === 'MENUNGGU_PEMBAYARAN' && (
                        <CountdownTimer expiryTimestamp={order.paymentDeadline} onTimerEnd={onUploadSuccess} />
                    )}
                </div>
                <div className="flex flex-col md:items-end justify-between gap-2 pt-2 border-t md:border-none md:pt-0">
                    <Link href={`/properties/${order.property.id}`} passHref><Button variant="outline" size="sm" className="w-full md:w-auto">Lihat Properti</Button></Link>
                    {order.status === 'MENUNGGU_PEMBAYARAN' && (
                        <div className="flex gap-2 w-full">
                            <UploadPaymentDialog invoiceNumber={order.invoiceNumber} onUploadSuccess={onUploadSuccess} />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-grow bg-red-500"
                                        disabled={isCancelling} 
                                    >
                                        {isCancelling ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Harap Tunggu...
                                            </>
                                        ) : (
                                            'Batalkan'
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>Tindakan ini akan membatalkan pesanan Anda.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Tidak</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-500" onClick={() => onCancel(order.invoiceNumber)} disabled={isCancelling}>
                                            {isCancelling ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Membatalkan...
                                                </>
                                            ) : (
                                                'Ya, Batalkan'
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    {order.status === 'DIPROSES' && (
                        <Button
                            size="sm"
                            onClick={() => onComplete(order.id)}
                            disabled={isCompleting} 
                            className="bg-green-500"
                        >
                            {isCompleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyelesaikan...
                                </>
                            ) : (
                                'Selesaikan Pesanan'
                            )}
                        </Button>
                    )}
                    {order.status === 'SELESAI' && !order.review && <WriteReviewDialog bookingId={order.id} propertyId={order.property.id} onReviewSubmit={onUploadSuccess} disabled={!canReview} />}
                </div>
            </CardContent>
        </Card>
    );
};