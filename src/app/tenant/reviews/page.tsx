'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { useTenantProperties } from '@/hooks/use-tenant-properties';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReplyReviewDialog from '@/components/tenant/ReplyReviewDialog';

// Definisikan tipe data untuk Review
export interface Review {
    id: string;
    rating: number;
    comment: string;
    reply: string | null;
    createdAt: string;
    user: {
        fullName: string;
        profilePicture: string | null;
    };
    property: {
        id: string;
        name: string;
    };
}

// Komponen Card Ulasan (bisa dipisah jika perlu)
const ReviewItemCard = ({ review, onReplyClick }: { review: Review, onReplyClick: () => void }) => (
    <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={review.user.profilePicture || undefined} alt={review.user.fullName} />
                        <AvatarFallback>{review.user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{review.user.fullName}</p>
                        <p className="text-sm text-gray-500">
                            Ulasan untuk properti: <strong>{review.property.name}</strong>
                        </p>
                        <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{review.rating.toFixed(1)}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="mb-4">{review.comment}</p>
            {review.reply ? (
                <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="font-semibold text-sm">Balasan Anda:</p>
                    <p className="text-sm text-gray-700">{review.reply}</p>
                </div>
            ) : (
                <Button onClick={onReplyClick}>Balas Ulasan</Button>
            )}
        </CardContent>
    </Card>
);


export default function TenantReviewsPage() {
    // 1. Ambil semua properti milik tenant
    const { properties, isLoading: isLoadingProperties } = useTenantProperties();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    useEffect(() => {
        const fetchReviewsForProperties = async () => {
            if (properties.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // 2. Buat array of promises untuk mengambil ulasan dari setiap properti
                const reviewPromises = properties.map(property =>
                    api.get(`/reviews/property/${property.id}`)
                );

                // 3. Ambil semua ulasan secara bersamaan
                const responses = await Promise.all(reviewPromises);

                // 4. Gabungkan semua ulasan menjadi satu array
                const allReviews = responses.flatMap(response => response.data.data);

                // Urutkan ulasan berdasarkan tanggal terbaru
                allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setReviews(allReviews);
            } catch (error) {
                toast.error('Gagal memuat sebagian data ulasan.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!isLoadingProperties) {
            fetchReviewsForProperties();
        }
    }, [properties, isLoadingProperties]);

    const handleReplySuccess = (updatedReview: Review) => {
        // Perbarui daftar ulasan setelah berhasil membalas
        setReviews(prevReviews =>
            prevReviews.map(r => r.id === updatedReview.id ? updatedReview : r)
        );
        setSelectedReview(null);
    };

    if (isLoading || isLoadingProperties) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">Ulasan Properti Anda</h1>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Ulasan Properti Anda</h1>

            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <ReviewItemCard
                            key={review.id}
                            review={review}
                            onReplyClick={() => setSelectedReview(review)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Anda belum menerima ulasan apa pun.</p>
                </div>
            )}

            {selectedReview && (
                <ReplyReviewDialog
                    review={selectedReview}
                    open={!!selectedReview}
                    onOpenChange={() => setSelectedReview(null)}
                    onSuccess={handleReplySuccess}
                />
            )}
        </div>
    );
}