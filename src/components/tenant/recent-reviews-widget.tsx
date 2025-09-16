"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/apiHelper';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: {
        fullName: string;
        profilePicture: string | null;
    };
}

export function RecentReviewsWidget() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // 1. Mengambil data dari endpoint baru yang aman
                const response = await api.get('/report/widgets');
                setReviews(response.data.data.recentReviews || []);
            } catch (error) {
                console.error('Gagal mengambil ulasan terbaru', error);
                setReviews([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Sisa kode JSX di bawah ini tidak perlu diubah
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ulasan Terbaru</CardTitle>
                <CardDescription>3 ulasan terakhir untuk properti Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex items-start space-x-4">
                                <Avatar>
                                    <AvatarImage src={review.user.profilePicture || undefined} />
                                    <AvatarFallback>{review.user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{review.user.fullName}</p>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span>{review.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Belum ada ulasan untuk properti Anda.
                    </p>
                )}
                <Button asChild variant="outline" className="w-full mt-6">
                    <Link href="/tenant/reviews">Lihat Semua Ulasan</Link>
                </Button>
            </CardContent>
        </Card>
    );
}