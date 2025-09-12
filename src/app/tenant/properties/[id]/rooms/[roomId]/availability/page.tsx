"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format, startOfMonth } from "date-fns";
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar";
import { PeakSeasonDialog, PeakSeason, PeakSeasonPayload } from "@/components/tenant/PeakSeasonDialog";
import { PeakSeasonList } from "@/components/tenant/PeakSeasonList";
import { useRoomAvailability } from "@/hooks/use-room-availability";
import api from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { AvailabilityDialog } from "@/components/tenant/AvailabilityDialog";
import { DateRange } from "react-day-picker";

export default function ManageAvailabilityPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const roomId = params.roomId as string;
  const { toast } = useToast();

  // --- PERBAIKAN 1: Ambil 'room' bukan 'roomName' ---
  const { room, availability, peakSeasons, isLoading, error, refetch } = useRoomAvailability(roomId);
  
  const [isPeakSeasonDialogOpen, setIsPeakSeasonDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<PeakSeason | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  if (isLoading) return <div>Memuat data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSaveAvailability = async (range: DateRange, isAvailable: boolean, price?: number) => {
    if (!range.from) {
      toast({ title: "Error", description: "Tanggal mulai harus dipilih.", variant: "destructive" });
      return;
    }
    try {
      // Endpoint ini mungkin perlu disesuaikan dengan BE Anda
      await api.post(`/properties/my-properties/${propertyId}/rooms/${roomId}/availability`, {
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to || range.from, "yyyy-MM-dd"),
        isAvailable,
        price: isAvailable ? price : undefined,
      });
      toast({ title: "Sukses", description: "Ketersediaan berhasil diperbarui." });
      refetch();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan.", variant: "destructive" });
    }
  };

  const handleSavePeakSeason = async (season: PeakSeasonPayload) => {
    try {
      const payload = { 
        ...season, 
        roomId, 
        startDate: format(season.startDate, 'yyyy-MM-dd'), 
        endDate: format(season.endDate, 'yyyy-MM-dd') 
      };
      if (season.id) {
        await api.put(`/peak-seasons/${season.id}`, payload);
      } else {
        await api.post('/peak-seasons', payload);
      }
      toast({ title: "Success", description: "Peak season saved." });
      refetch();
      setIsPeakSeasonDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal menyimpan.", variant: "destructive" });
    }
  };

  const handleDeletePeakSeason = async (id: string) => {
    if (confirm('Anda yakin ingin menghapus peak season ini?')) {
      try {
        await api.delete(`/peak-seasons/${id}`);
        toast({ title: 'Success', description: 'Peak season dihapus.' });
        refetch();
      } catch (error) {
        toast({ title: 'Error', description: 'Gagal menghapus peak season.', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <Link href={`/tenant/properties/${propertyId}/rooms`} className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali ke Daftar Kamar
      </Link>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle>Manajemen Ketersediaan & Harga Harian</CardTitle>
              {/* --- PERBAIKAN 2: Gunakan room.name --- */}
              <CardDescription>Kamar: <strong>{room?.name || "Memuat..."}</strong></CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* --- PERBAIKAN 3: Kirim props yang benar ke Kalender --- */}
          <AvailabilityCalendar
            basePrice={room?.basePrice || 0}
            availabilityData={availability}
            peakSeasons={peakSeasons}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onSave={handleSaveAvailability}
          />
        </CardContent>
      </Card>
      <Separator />
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold">Manajemen Peak Season</h2>
            <p className="text-muted-foreground">Tentukan periode harga khusus seperti hari libur.</p>
          </div>
          <Button onClick={() => { setEditingSeason(null); setIsPeakSeasonDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Peak Season
          </Button>
        </div>
        <PeakSeasonList seasons={peakSeasons} onEdit={(season) => { setEditingSeason(season); setIsPeakSeasonDialogOpen(true); }} onDelete={handleDeletePeakSeason} />
      </div>
      <PeakSeasonDialog 
          isOpen={isPeakSeasonDialogOpen} 
          onClose={() => setIsPeakSeasonDialogOpen(false)} 
          onSave={handleSavePeakSeason} 
          initialData={editingSeason} 
          roomId={roomId} 
          onSuccess={refetch} 
      />
    </div>
  );
}