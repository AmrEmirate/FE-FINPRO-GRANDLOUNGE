'use client';

import { useState } from 'react';
import { useReviews, OrderForReview } from '@/hooks/use-reviews';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ReviewFormDialog } from '@/components/reviews/review-form-dialog';
import { ReviewCard } from '@/components/reviews/review-card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ReviewPageContent = () => {
    const { orders, isLoading, error, submitReview } = useReviews();
    const [selectedOrder, setSelectedOrder] = useState<OrderForReview | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = (order: OrderForReview) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleDialogSubmit = async (rating: number, comment: string) => {
        if (selectedOrder) {
            await submitReview(selectedOrder.id, selectedOrder.property.id, rating, comment);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Ulasan Saya</h1>
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center">
                Terjadi kesalahan: {error}
            </div>
        );
    }

    const toReviewOrders = orders.filter((order) => !order.review);
    const reviewedOrders = orders.filter((order) => order.review);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Ulasan Saya</h1>

            {/* Bagian Untuk Diulas */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Perlu Diulas</h2>
                {toReviewOrders.length > 0 ? (
                    <div className="space-y-4">
                        {toReviewOrders.map((order) => (
                            <Card key={order.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={order.property.images?.[0]?.url || '/placeholder.jpg'}
                                            alt={order.property.name}
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-bold">{order.property.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Check-out:{' '}
                                                {format(new Date(order.checkOutDate), 'd MMMM yyyy', {
                                                    locale: id,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleOpenDialog(order)}>
                                        Tulis Ulasan
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Tidak ada penginapan yang perlu diulas saat ini.</p>
                )}
            </div>

            {/* Bagian Ulasan yang Sudah Diberikan */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Ulasan Anda</h2>
                {reviewedOrders.length > 0 ? (
                    <div className="space-y-4">
                        {reviewedOrders.map((order) => (
                            order.review ? <ReviewCard key={order.id} review={order.review} /> : null
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Anda belum memberikan ulasan apa pun.</p>
                )}
            </div>

            {/* Dialog Form Ulasan */}
            {selectedOrder && (
                <ReviewFormDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSubmit={handleDialogSubmit}
                    propertyName={selectedOrder.property.name}
                />
            )}
        </div>
    );
};

export default function ReviewPage() {
    return (
        <ProtectedRoute role="USER">
            <ReviewPageContent />
        </ProtectedRoute>
    );
}