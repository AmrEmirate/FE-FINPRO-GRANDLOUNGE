"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import apiHelper from "@/lib/apiHelper";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Komponen untuk menampilkan status verifikasi dan tombol aksi
export function VerificationStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani pengiriman ulang email verifikasi
  const handleResendVerification = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Email pengguna tidak ditemukan.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // --- PERBAIKAN ---
      // Kirim email pengguna di dalam body permintaan POST
      await apiHelper.post('/auth/resend-verification', { email: user.email });
      // -----------------
      
      toast({
        title: 'Email Terkirim',
        description: 'Email verifikasi telah dikirim ke alamat email Anda.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal mengirim email verifikasi.';
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Jika data user belum ada, jangan render apa-apa
  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Verifikasi Akun</CardTitle>
        <CardDescription>
          Berikut adalah status verifikasi email Anda saat ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Status:</span>
          {user.verified ? (
            <Badge variant="success">Terverifikasi</Badge>
          ) : (
            <Badge variant="destructive">Belum Terverifikasi</Badge>
          )}
        </div>
        
        {!user.verified && (
          <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-800">
              Akun Anda belum terverifikasi. Silakan verifikasi email Anda untuk mendapatkan akses penuh ke semua fitur.
            </p>
            <Button
              className="mt-3"
              onClick={handleResendVerification}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirim Ulang Email Verifikasi
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}