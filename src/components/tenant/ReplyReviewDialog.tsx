'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

interface ReplyReviewDialogProps {
    reviewId: string;
    onReplySubmit: () => void;
}

export default function ReplyReviewDialog({ reviewId, onReplySubmit }: ReplyReviewDialogProps) {
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Asumsi endpoint untuk membalas review
            await api.patch(`/reviews/${reviewId}/reply`, { reply });
            toast({
                title: 'Balasan Terkirim',
            });
            onReplySubmit();
            setOpen(false);
        } catch (error: any) {
            toast({
                title: 'Gagal Mengirim Balasan',
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
                <Button variant="outline" size="sm">Balas Ulasan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Balas Ulasan</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reply">Balasan Anda</Label>
                        <Textarea
                            id="reply"
                            placeholder="Tulis balasan Anda di sini..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Mengirim...' : 'Kirim Balasan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
