"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import apiHelper from "@/lib/apiHelper";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const emailChangeFormSchema = z.object({
  newEmail: z.string().email({ message: "Format email tidak valid." }),
});

type EmailChangeFormValues = z.infer<typeof emailChangeFormSchema>;

export function EmailChangeForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<EmailChangeFormValues>({
        resolver: zodResolver(emailChangeFormSchema),
        defaultValues: { newEmail: "" },
    });

    async function onSubmit(data: EmailChangeFormValues) {
        setIsLoading(true);
        setIsSubmitted(false);
        try {
            await apiHelper.post("/user/request-email-change", { newEmail: data.newEmail });
            toast({ 
                title: "Permintaan Terkirim", 
                description: `Email konfirmasi telah dikirim ke alamat email lama Anda (${user?.email}).`
            });
            setIsSubmitted(true);
            form.reset();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal Mengirim Permintaan",
                description: error.response?.data?.message || "Terjadi kesalahan.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    if (isSubmitted) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                <p><strong>Silakan periksa email Anda!</strong></p>
                <p>Kami telah mengirimkan tautan verifikasi ke alamat email lama Anda untuk mengonfirmasi perubahan ini.</p>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="newEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Baru</FormLabel>
                            <FormControl><Input type="email" placeholder="Masukkan alamat email baru Anda" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ubah Email
                    </Button>
                </div>
            </form>
        </Form>
    );
}