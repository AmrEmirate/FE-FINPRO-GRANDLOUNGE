// src/app/tenant/properties/[id]/rooms/[roomId]/availability/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar";
import { PeakSeasonDialog, PeakSeason } from "@/components/tenant/PeakSeasonDialog";
import { AvailabilityDialog } from "@/components/tenant/AvailabilityDialog";
import { PeakSeasonList } from "@/components/tenant/PeakSeasonList";
import { useAvailabilityManager } from "@/hooks/use-availability-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Plus, CalendarCog } from "lucide-react";

export default function ManageAvailabilityPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const roomId = params.roomId as string;

  const {
    room,
    availability,
    peakSeasons,
    isLoading,
    error,
    currentMonth,
    setCurrentMonth,
    handleSaveAvailability,
    handleSavePeakSeason,
    handleDeletePeakSeason,
    refetch,
  } = useAvailabilityManager(propertyId, roomId);

  const [isPeakSeasonDialogOpen, setIsPeakSeasonDialogOpen] = useState(false);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<PeakSeason | null>(null);

  if (isLoading) return <div>Memuat data...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  const openPeakSeasonDialog = (season: PeakSeason | null) => {
    setEditingSeason(season);
    setIsPeakSeasonDialogOpen(true);
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
              <CardDescription>Kamar: <strong>{room?.name || "Memuat..."}</strong></CardDescription>
            </div>
            <Button onClick={() => setIsAvailabilityDialogOpen(true)}>
              <CalendarCog className="mr-2 h-4 w-4" /> Atur Ketersediaan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
          <Button onClick={() => openPeakSeasonDialog(null)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Peak Season
          </Button>
        </div>
        <PeakSeasonList seasons={peakSeasons} onEdit={openPeakSeasonDialog} onDelete={handleDeletePeakSeason} />
      </div>

      <PeakSeasonDialog 
       isOpen={isPeakSeasonDialogOpen} 
       onClose={() => setIsPeakSeasonDialogOpen(false)} 
       onSave={handleSavePeakSeason} 
       initialData={editingSeason} 
       roomId={roomId} 
       onSuccess={refetch} // <-- TAMBAHKAN BARIS INI
      />

      <AvailabilityDialog
        isOpen={isAvailabilityDialogOpen}
        onClose={() => setIsAvailabilityDialogOpen(false)}
        onSave={handleSaveAvailability}
        roomId={roomId}
        onSuccess={refetch}
      />
    </div>
  );
}