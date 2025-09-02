"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import apiHelper from "@/lib/apiHelper";

const profileFormSchema = z.object({
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { fullName: "" },
  });

  useEffect(() => {
    if (user) {
        form.reset({ fullName: user.fullName });
    }
  }, [user, form.reset]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    if (selectedFile) {
      formData.append('profilePicture', selectedFile);
    }

    try {
      await apiHelper.patch('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const token = localStorage.getItem('authToken');
      if (token) {
        login(token); // Panggil login dengan token untuk refresh data user
      }
      
      toast({ title: "Sukses", description: "Profil Anda telah diperbarui." });
    } catch (error: any) {
      toast({ 
          variant: "destructive", 
          title: "Update Gagal", 
          description: error.response?.data?.message || "Tidak dapat memperbarui profil Anda." 
      });
    } finally {
        setIsLoading(false);
    }
  }

  if (!user) return <p>Memuat form...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  );
}