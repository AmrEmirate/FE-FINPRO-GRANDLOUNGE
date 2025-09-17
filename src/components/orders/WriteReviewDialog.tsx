'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

interface WriteReviewDialogProps {
    bookingId: string;
    propertyId: string;
    onReviewSubmit: () => void; 
    disabled?: boolean;
}

export default function WriteReviewDialog({ bookingId, propertyId, onReviewSubmit, disabled }: WriteReviewDialogProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: 'Rating diperlukan',
                description: 'Silakan pilih setidaknya satu bintang.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/reviews', {
                bookingId,
                propertyId,
                rating,
                comment,
            });
            toast({
                title: 'Ulasan Terkirim',
                description: 'Terima kasih atas ulasan Anda!',
            });
            onReviewSubmit(); // Panggil callback
            setOpen(false); // Tutup dialog
        } catch (error: any) {
            toast({
                title: 'Gagal Mengirim Ulasan',
                description: error.response?.data?.message || 'Terjadi kesalahan.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" disabled={disabled}>
                    Tulis Ulasan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Bagaimana pengalaman Anda?</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Rating Anda</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-7 w-7 cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                        }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comment">Komentar (Opsional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Ceritakan lebih lanjut tentang pengalaman menginap Anda..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
