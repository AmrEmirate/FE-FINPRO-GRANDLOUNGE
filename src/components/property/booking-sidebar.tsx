"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useAuth } from "@/context/AuthContext" // 1. Impor useAuth
import { useToast } from "@/hooks/use-toast"   // 2. Impor useToast

interface BookingSidebarProps {
  selectedRoom: {
    id: number
    type: string
    price: number
    description: string
    available: boolean
  }
}

// Komponen ini tidak lagi menerima onBooking, karena logikanya ditangani di sini
export function BookingSidebar({ selectedRoom }: BookingSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const { isAuthenticated, user } = useAuth(); // 3. Dapatkan status auth & data user
  const { toast } = useToast();
  const router = useRouter();

  const handleBookingClick = () => {
    // 4. Validasi berlapis sebelum booking
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Anda Belum Login",
        description: "Silakan masuk untuk melanjutkan pemesanan.",
      })
      router.push("/auth/login?type=user");
      return;
    }

    if (!user?.verified) {
      toast({
        variant: "destructive",
        title: "Akun Belum Terverifikasi",
        description: "Silakan verifikasi email Anda terlebih dahulu.",
      })
      return;
    }

    if (!selectedDate) {
      toast({
          variant: "destructive",
          title: "Tanggal Belum Dipilih",
          description: "Silakan pilih tanggal check-in.",
      });
      return
    }

    // Jika semua validasi lolos, lanjutkan ke proses booking
    console.log("Proceeding to booking page...");
    // Di sini Anda bisa arahkan ke halaman pembayaran
    // router.push(`/payment?roomId=${selectedRoom.id}&date=${selectedDate}`);
    toast({
        title: "Redirecting to Booking Page",
        description: "Fitur booking selanjutnya belum diimplementasikan.",
    });
  }
  
  // 5. Tentukan pesan dan status disabled untuk tombol
  let buttonText = "Book Now";
  let isDisabled = !selectedRoom.available;

  if (!isAuthenticated) {
    buttonText = "Login to Book";
  } else if (!user?.verified) {
    buttonText = "Verify Email to Book";
    isDisabled = true;
  } else if (!selectedRoom.available) {
    buttonText = "Not Available";
  }


  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Stay</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">Rp {selectedRoom.price.toLocaleString("id-ID")}</div>
            <div className="text-sm text-gray-600">/night</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Selected Room</h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium">{selectedRoom.type}</div>
            <div className="text-sm text-gray-600">{selectedRoom.description}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Select Check-in Date</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />

          {selectedDate && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <div className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
              <div className="text-blue-600">Price: Rp {selectedRoom.price.toLocaleString("id-ID")}/night</div>
            </div>
          )}
        </div>

        <Button onClick={handleBookingClick} className="w-full" size="lg" disabled={isDisabled}>
            {buttonText}
        </Button>

        <div className="text-xs text-gray-500 text-center">You won't be charged yet</div>
      </CardContent>
    </Card>
  )
}
