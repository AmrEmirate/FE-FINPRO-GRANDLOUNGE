// amremirate/fe-finpro-grandlounge/FE-FINPRO-GRANDLOUNGE-1b5195a7f61778c5ef007ba51f4204746b0e65d7/src/components/orders/WriteReviewDialog.tsx

'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import api from '@/utils/api';
import { Star } from 'lucide-react';

interface WriteReviewDialogProps {
    bookingId: string;
    propertyId: string;
    onReviewSubmit: () => void;
    disabled?: boolean; // Tambahkan properti disabled di sini
}

const WriteReviewDialog = ({
    bookingId,
    propertyId,
    onReviewSubmit,
    disabled = false, // Beri nilai default
}: WriteReviewDialogProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                variant: 'destructive',
                title: 'Rating Diperlukan',
                description: 'Silakan berikan rating bintang.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/reviews', {
                propertyId,
                bookingId,
                rating,
                comment,
            });
            toast({
                title: 'Berhasil',
                description: 'Ulasan Anda telah berhasil dikirim.',
            });
            onReviewSubmit();
            setIsOpen(false); // Tutup dialog setelah berhasil
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || 'Gagal mengirim ulasan.';
            toast({
                variant: 'destructive',
                title: 'Gagal',
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button size="sm" disabled={disabled}>
                    Beri Ulasan
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bagaimana pengalaman menginap Anda?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Beri rating dan ulasan untuk membantu kami menjadi lebih baik.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-center justify-center space-x-1 my-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            fill={rating >= star ? 'currentColor' : 'none'}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>

                <Textarea
                    placeholder="Tulis ulasan Anda di sini..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default WriteReviewDialog;