'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import ReplyReviewDialog from '@/components/tenant/ReplyReviewDialog';

// Definisikan tipe data untuk review
interface ReviewData {
    id: string;
    rating: number;
    comment: string;
    reply: string | null;
    user: {
        fullName: string;
    };
    property: {
        name: string;
    };
    createdAt: string;
}

export default function TenantReviewsPage() {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            // Asumsi endpoint untuk mendapatkan semua review untuk tenant
            const response = await api.get('/reviews/tenant');
            setReviews(response.data.data);
        } catch (error) {
            toast({
                title: 'Gagal memuat ulasan',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    if (isLoading) {
        return <div><Skeleton className="h-8 w-1/4 mb-4" /><Skeleton className="h-40 w-full" /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Ulasan Properti Anda</h1>
            {reviews.length === 0 ? (
                <p>Belum ada ulasan untuk properti Anda.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{review.user.fullName}</CardTitle>
                                        <p className="text-sm text-gray-500">
                                            Mengulas properti: {review.property.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array(review.rating).fill(0).map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                        {Array(5 - review.rating).fill(0).map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-gray-300" />
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="italic">"{review.comment}"</p>
                                {review.reply ? (
                                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                                        <p className="font-semibold text-sm">Balasan Anda:</p>
                                        <p className="text-sm">{review.reply}</p>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <ReplyReviewDialog reviewId={review.id} onReplySubmit={fetchReviews} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
