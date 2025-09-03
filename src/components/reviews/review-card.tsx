'use client'; // Pastikan ini ada di baris paling atas

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Definisikan tipe data yang lebih akurat
interface ReviewData {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        fullName: string;
        profilePicture?: string | null;
    };
    reply?: {
        comment: string;
        createdAt: string;
    } | null;
}

interface ReviewCardProps {
    review: ReviewData;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
    // Pengaman jika data user tidak ada
    const userName = review.user?.fullName || 'Anonymous';
    const userAvatar = review.user?.profilePicture;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            {/* --- PERBAIKAN 1 --- */}
                            <AvatarImage src={userAvatar || undefined} alt={userName} />
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                        <div>
                            {/* --- PERBAIKAN 2 --- */}
                            <CardTitle className="text-base font-semibold">{userName}</CardTitle>
                            <p className="text-xs text-gray-500">
                                {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                className={`h-5 w-5 ${index < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-700">{review.comment}</p>
                {review.reply && (
                    <div className="mt-4 rounded-md bg-gray-100 p-4">
                        <p className="text-sm font-semibold">Balasan dari Tenant</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {/* Pastikan `createdAt` ada di objek `reply` jika Anda ingin menampilkannya */}
                            {review.reply.createdAt && format(new Date(review.reply.createdAt), 'd MMMM yyyy', { locale: id })}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">{review.reply.comment}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};