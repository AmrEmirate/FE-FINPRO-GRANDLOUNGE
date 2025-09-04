// src/components/reviews/review-card.tsx (SUDAH DIPERBAIKI)

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Review } from '@/hooks/use-reviews';

interface ReviewCardProps {
    review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={review.user.profilePicture} alt={review.user.fullName} />
                            <AvatarFallback>{review.user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base font-semibold">{review.user.fullName}</CardTitle>
                            {review.property && (
                                <p className="text-xs text-gray-500">
                                    Ulasan untuk:{' '}
                                    <Link
                                        href={`/properties/${review.property.id}`}
                                        className="hover:underline text-blue-600 font-medium"
                                    >
                                        {review.property.name}
                                    </Link>
                                </p>
                            )}
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

                {/* --- BAGIAN INI YANG DIPERBAIKI --- */}
                {review.reply && (
                    <Card className="mt-3 ml-10 bg-gray-100">
                        <CardContent className="p-4">
                            <p className="font-semibold text-sm">Balasan dari pemilik:</p>
                            {/* Cukup tampilkan 'review.reply' secara langsung */}
                            <p className="text-sm text-gray-600">{review.reply}</p>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};