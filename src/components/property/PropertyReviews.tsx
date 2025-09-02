import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Review } from '@/lib/types'; // Asumsi tipe Review sudah ada

interface PropertyReviewsProps {
    reviews: Review[];
}

export default function PropertyReviews({ reviews }: PropertyReviewsProps) {
    if (!reviews || reviews.length === 0) {
        return (
            <div id="reviews" className="mt-8 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-4">Ulasan</h2>
                <p>Belum ada ulasan untuk properti ini.</p>
            </div>
        );
    }

    return (
        <div id="reviews" className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-4">Ulasan ({reviews.length})</h2>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id}>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={review.user.profilePicture} alt={review.user.fullName} />
                                <AvatarFallback>{review.user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{review.user.fullName}</p>
                                <div className="flex items-center gap-1">
                                    {Array(review.rating).fill(0).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                    {Array(5 - review.rating).fill(0).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-gray-300" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-gray-700 italic">"{review.comment}"</p>
                        {review.reply && (
                            <Card className="mt-3 ml-10 bg-gray-50">
                                <CardContent className="p-4">
                                    <p className="font-semibold text-sm">Balasan dari pemilik:</p>
                                    <p className="text-sm text-gray-600">{review.reply}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
