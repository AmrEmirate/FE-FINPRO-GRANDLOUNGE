import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface ReviewFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    propertyName: string;
}

export const ReviewFormDialog = ({
    open,
    onOpenChange,
    onSubmit,
    propertyName,
}: ReviewFormDialogProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0 || comment.trim() === '') {
            alert('Rating dan komentar tidak boleh kosong.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(rating, comment);
            onOpenChange(false); // Tutup dialog setelah berhasil
            setRating(0); // Reset state
            setComment('');
        } catch (error) {
            // Pesan error sudah ditangani oleh hook
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Beri Ulasan untuk {propertyName}</DialogTitle>
                    <DialogDescription>
                        Bagikan pengalaman menginap Anda untuk membantu pengguna lain.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="rating">Rating Anda</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`cursor-pointer ${(hoverRating || rating) >= star
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="comment">Komentar Anda</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ceritakan pengalaman Anda di sini..."
                            rows={5}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0 || !comment.trim()}
                    >
                        {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};