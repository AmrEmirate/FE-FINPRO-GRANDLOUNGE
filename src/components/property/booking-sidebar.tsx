"use client"

import { useRouter } from "next/navigation"
import { differenceInDays, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Room } from "@/lib/types"
import type { DateRange } from "react-day-picker"

// Definisikan props yang baru
interface BookingSidebarProps {
  selectedRoom: Room | null
  selectedRange: DateRange | undefined
}

export function BookingSidebar({ selectedRoom, selectedRange }: BookingSidebarProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to book a room.",
      })
      router.push("/auth/login")
      return
    }

    // Validasi berdasarkan rentang tanggal
    if (!selectedRoom || !selectedRange?.from || !selectedRange?.to) {
      toast({
        variant: "destructive",
        title: "Incomplete Selection",
        description: "Please select a room and a complete date range.",
      })
      return
    }
    
    toast({
      title: "Booking Initiated",
      description: `Proceeding to book ${selectedRoom.name}.`,
    })
    
    // TODO: Arahkan ke halaman checkout
  }

  // Kalkulasi harga berdasarkan tanggal yang dipilih
  const price = selectedRoom?.basePrice || 0
  const checkIn = selectedRange?.from
  const checkOut = selectedRange?.to
  const numberOfNights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const totalPrice = price * numberOfNights

  return (
    <Card className="sticky top-24 shadow-md">
      <CardHeader>
        <CardTitle>
          {selectedRoom ? `Rp ${price.toLocaleString("id-ID")} / night` : "Select a Room"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tampilkan tanggal yang dipilih, bukan kalender */}
        <div className="grid grid-cols-2 gap-4 border p-3 rounded-md">
            <div>
                <Label className="text-sm font-semibold text-gray-600">Check-in</Label>
                <p className="font-medium">{checkIn ? format(checkIn, "dd MMM yyyy") : "Select date"}</p>
            </div>
             <div>
                <Label className="text-sm font-semibold text-gray-600">Check-out</Label>
                <p className="font-medium">{checkOut ? format(checkOut, "dd MMM yyyy") : "Select date"}</p>
            </div>
        </div>
        
        {/* Tampilkan rincian biaya jika tanggal sudah dipilih */}
        {numberOfNights > 0 && selectedRoom && (
            <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-700">
                    <p>Rp {price.toLocaleString("id-ID")} x {numberOfNights} night(s)</p>
                    <p>Rp {totalPrice.toLocaleString("id-ID")}</p>
                </div>
                 <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                    <p>Total Price</p>
                    <p>Rp {totalPrice.toLocaleString("id-ID")}</p>
                </div>
            </div>
        )}
        
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button 
          onClick={handleBookingClick} 
          className="w-full" 
          size="lg" 
          disabled={!selectedRoom || !selectedRange?.from || !selectedRange?.to}
        >
          {isAuthenticated ? "Book Now" : "Login to Book"}
        </Button>
        <p className="text-xs text-gray-500 text-center">You won't be charged yet</p>
      </CardFooter>
    </Card>
  )
}