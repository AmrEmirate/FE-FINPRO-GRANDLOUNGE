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
import { Separator } from "@/components/ui/separator"; // Impor Separator
import { EmailChangeForm } from "./email-change-form"; // Impor form ganti email

const securityFormSchema = z.object({
  oldPassword: z.string().min(1, { message: "Password saat ini harus diisi." }),
  newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter." }),
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function SecurityForm() {
    const { toast } = useToast();
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const form = useForm<SecurityFormValues>({
        resolver: zodResolver(securityFormSchema),
        defaultValues: { oldPassword: "", newPassword: "" },
    });

    async function onSubmitPassword(data: SecurityFormValues) {
        setIsLoadingPassword(true);
        try {
            await apiHelper.patch("/user/password", data);
            toast({ title: "Sukses", description: "Password berhasil diubah." });
            form.reset();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal Mengubah Password",
                description: error.response?.data?.message || "Terjadi kesalahan.",
            });
        } finally {
            setIsLoadingPassword(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Form Ganti Password */}
            <div>
                <h3 className="text-lg font-medium">Ubah Password</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-6 mt-4">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Saat Ini</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Baru</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoadingPassword}>
                                {isLoadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ubah Password
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            
            <Separator />

            {/* Form Ganti Email */}
            <div>
                <h3 className="text-lg font-medium">Ubah Alamat Email</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sebuah tautan verifikasi akan dikirim ke alamat email lama Anda untuk konfirmasi.
                </p>
                <div className="mt-4">
                    <EmailChangeForm />
                </div>
            </div>
        </div>
    );
}