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

const securityFormSchema = z.object({
  oldPassword: z.string().min(1, { message: "Password saat ini harus diisi." }),
  newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter." }),
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function SecurityForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SecurityFormValues>({
        resolver: zodResolver(securityFormSchema),
        defaultValues: { oldPassword: "", newPassword: "" },
    });

    async function onSubmit(data: SecurityFormValues) {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ubah Password
                    </Button>
                </div>
            </form>
        </Form>
    );
}