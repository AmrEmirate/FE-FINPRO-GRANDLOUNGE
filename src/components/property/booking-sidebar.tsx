"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Room } from "@/lib/types" // Impor tipe Room dari types

// Definisikan props untuk komponen
interface BookingSidebarProps {
  rooms: Room[];
  selectedRoom: Room | null;
}

export function BookingSidebar({ rooms, selectedRoom }: BookingSidebarProps) {
  // State untuk menyimpan tanggal check-in yang dipilih
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  
  // Hooks untuk navigasi, autentikasi, dan notifikasi
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Logika untuk menangani klik tombol booking
  const handleBookingClick = () => {
    // 1. Cek apakah pengguna sudah login
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to book a room.",
      });
      router.push("/auth/login");
      return;
    }

    // 2. Cek apakah kamar dan tanggal sudah dipilih
    if (!selectedRoom) {
      toast({
        variant: "destructive",
        title: "No Room Selected",
        description: "Please select a room from the list.",
      });
      return;
    }
    if (!checkInDate) {
        toast({
          variant: "destructive",
          title: "No Date Selected",
          description: "Please select a check-in date.",
        });
        return;
      }
    
    // 3. Lanjutkan ke proses booking (misalnya, ke halaman pembayaran)
    // Untuk saat ini, kita hanya menampilkan notifikasi sukses
    toast({
      title: "Booking Initiated",
      description: `Proceeding to book ${selectedRoom.name} for ${checkInDate.toLocaleDateString()}.`,
    });
    
    // TODO: Arahkan ke halaman checkout atau panggil API booking
    // router.push(`/checkout?roomId=${selectedRoom.id}&date=${checkInDate.toISOString()}`);
  };

  // Tentukan harga dan detail kamar yang akan ditampilkan
  // Jika ada kamar yang dipilih, gunakan itu. Jika tidak, gunakan kamar pertama sebagai default.
  const displayRoom = selectedRoom || rooms[0];
  const price = displayRoom?.basePrice || 0;
  const roomName = displayRoom?.name || "Please select a room";
  const roomDescription = displayRoom?.description || "Select a room from the list to see details.";

  return (
    <Card className="sticky top-24 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Stay</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              Rp {price.toLocaleString("id-ID")}
            </div>
            <div className="text-sm text-gray-600">/night</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 text-gray-800">Selected Room</h4>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="font-semibold text-gray-900">{roomName}</div>
            <p className="text-xs text-gray-600 mt-1">{roomDescription}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-gray-800">Select Check-in Date</h4>
          <Calendar
            mode="single"
            selected={checkInDate}
            onSelect={setCheckInDate}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Nonaktifkan tanggal kemarin
            className="rounded-md border"
          />
        </div>

        <Button 
          onClick={handleBookingClick} 
          className="w-full" 
          size="lg" 
          disabled={!selectedRoom || !checkInDate}
        >
          {isAuthenticated ? "Book Now" : "Login to Book"}
        </Button>

        <div className="text-xs text-gray-500 text-center">You won't be charged yet</div>
      </CardContent>
    </Card>
  );
}