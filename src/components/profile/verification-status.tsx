"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiHelper from "@/lib/apiHelper";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export function VerificationStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await apiHelper.post("/auth/resend-verification-email");
      toast({
        title: "Email Terkirim",
        description: "Tautan verifikasi baru telah dikirim ke email Anda.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {user.verified ? (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Email Terverifikasi</AlertTitle>
          <AlertDescription className="text-green-700">
            Akun Anda sudah terverifikasi dan aman.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Email Belum Terverifikasi</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <p className="mb-2 sm:mb-0">
                    Untuk keamanan akun, silakan verifikasi alamat email Anda.
                </p>
                <Button onClick={handleResendVerification} disabled={isLoading} size="sm">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kirim Ulang Verifikasi
                </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}