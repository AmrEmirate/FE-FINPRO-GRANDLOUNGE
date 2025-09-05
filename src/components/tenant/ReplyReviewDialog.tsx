'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Review } from '@/app/tenant/reviews/page'; // Impor tipe Review

// 1. Definisikan props yang akan diterima oleh komponen
interface ReplyReviewDialogProps {
    review: Review;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (updatedReview: Review) => void;
}

// 2. Gunakan props yang sudah didefinisikan
export default function ReplyReviewDialog({ review, open, onOpenChange, onSuccess }: ReplyReviewDialogProps) {
    const [reply, setReply] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reply.trim()) {
            toast.warning('Balasan tidak boleh kosong.');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Mengirim balasan...');

        try {
            const response = await api.post(`/reviews/${review.id}/reply`, { reply });
            toast.success('Balasan berhasil dikirim.', { id: toastId });
            onSuccess(response.data.data); // Panggil onSuccess dengan data terbaru
            onOpenChange(false); // Tutup dialog
            setReply(''); // Kosongkan textarea
        } catch (error: any) {
            toast.error('Gagal mengirim balasan.', {
                id: toastId,
                description: error.response?.data?.message || 'Terjadi kesalahan.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 3. Kontrol status dialog menggunakan props 'open' dan 'onOpenChange'
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Balas Ulasan</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Anda membalas ulasan dari <strong>{review.user.fullName}</strong> untuk properti <strong>{review.property.name}</strong>.
                    </p>
                    <p className="text-sm border-l-4 pl-3 mb-4 italic">"{review.comment}"</p>
                    <Textarea
                        placeholder="Tulis balasan Anda di sini..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Mengirim...' : 'Kirim Balasan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}