"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Komponen ini tidak lagi memerlukan props isLoading dan onEmailVerification
export function VerificationStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk mengirim ulang email verifikasi
  const handleResendVerification = async () => {
    setIsLoading(true);
    // Di sini Anda bisa menambahkan logika pemanggilan API ke backend
    // untuk mengirim ulang email.
    try {
      // await apiHelper.post('/auth/resend-verification', { email: user?.email });
      toast({ title: "Info", description: `Email verifikasi baru telah dikirim ke ${user?.email}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal mengirim email verifikasi." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p>Memuat status verifikasi...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-medium">Verifikasi Email</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {user.verified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="default" className="bg-green-100 text-green-800">
                Terverifikasi
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <Badge variant="destructive">Belum Diverifikasi</Badge>
            </>
          )}
        </div>
      </div>

      {!user.verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            Silakan verifikasi alamat email Anda untuk mengamankan akun dan menerima pembaruan penting.
          </p>
          <Button onClick={handleResendVerification} disabled={isLoading} className="mt-3" size="sm">
            {isLoading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
          </Button>
        </div>
      )}
    </div>
  );
}