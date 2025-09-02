'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import api from '@/utils/api';

interface Props {
    invoiceNumber: string;
    onUploadSuccess: () => void;
}

export default function UploadPaymentDialog({ invoiceNumber, onUploadSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 1 * 1024 * 1024) {
                toast({ variant: 'destructive', title: 'Error', description: 'Ukuran file maksimal 1MB.' });
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
                toast({ variant: 'destructive', title: 'Error', description: 'Hanya file .jpg atau .png yang diperbolehkan.' });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append('paymentProof', file);

        try {
            await api.post(`/payments/${invoiceNumber}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast({ title: 'Sukses', description: 'Bukti pembayaran berhasil diunggah.' });
            onUploadSuccess();
            setOpen(false); // Tutup dialog setelah berhasil
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal mengunggah bukti pembayaran.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">Unggah Bukti Bayar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Unggah Bukti Pembayaran</DialogTitle>
                    <DialogDescription>
                        Pilih file gambar (.jpg atau .png) dengan ukuran maksimal 1MB.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment-proof" className="text-right">
                            File
                        </Label>
                        <Input id="payment-proof" type="file" className="col-span-3" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!file || isLoading}>
                        {isLoading ? 'Mengunggah...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}