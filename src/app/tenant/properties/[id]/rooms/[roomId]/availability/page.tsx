"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
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
import { ArrowLeft } from "lucide-react";
import { AvailabilityDialog } from "@/components/tenant/AvailabilityDialog";
import { DateRange } from "react-day-picker";

export default function ManageAvailabilityPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const roomId = params.roomId as string;
  const { toast } = useToast();

  const {
    roomName,
    basePrice,
    availability,
    currentMonth,
    setCurrentMonth,
    handleSave,
    fetchAvailability,
  } = useRoomAvailability(propertyId, roomId);

  const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<PeakSeason | null>(null);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);

  const fetchPeakSeasons = useCallback(async () => {
    if (!roomId) return;
    try {
      const response = await api.get(`/peak-seasons/by-room/${roomId}`);
      
      // --- PERBAIKAN ZONA WAKTU DI SINI ---
      setPeakSeasons(response.data.data.map((s: any) => {
        // Ambil hanya bagian tanggal 'YYYY-MM-DD' dari string ISO
        const startDateStr = s.startDate.split('T')[0];
        const endDateStr = s.endDate.split('T')[0];

        // Buat objek Date baru secara manual untuk menghindari konversi timezone
        const [startY, startM, startD] = startDateStr.split('-').map(Number);
        const [endY, endM, endD] = endDateStr.split('-').map(Number);

        return {
          ...s,
          startDate: new Date(startY, startM - 1, startD),
          endDate: new Date(endY, endM - 1, endD),
        };
      }));
    } catch (error) {
      toast({ title: "Error fetching peak seasons", variant: "destructive" });
    }
  }, [roomId, toast]);

  useEffect(() => {
    fetchPeakSeasons();
  }, [fetchPeakSeasons]);

  const handleSavePeakSeason = async (season: PeakSeasonPayload) => {
    try {
      const payload = {
        ...season,
        roomId: roomId,
        startDate: format(season.startDate, 'yyyy-MM-dd'),
        endDate: format(season.endDate, 'yyyy-MM-dd'),
      };
      if (season.id) {
        await api.put(`/peak-seasons/${season.id}`, payload);
      } else {
        await api.post('/peak-seasons', payload);
      }
      toast({ title: "Success", description: "Peak season saved." });
      fetchPeakSeasons();
      fetchAvailability();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving peak season",
        description: error.response?.data?.message || "An error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleSaveAvailability = (range: DateRange, isAvailable: boolean) => {
    handleSave(range, isAvailable, undefined);
  };

  const handleDeletePeakSeason = async (id: string) => {
    if (confirm('Are you sure you want to delete this peak season?')) {
      try {
        await api.delete(`/peak-seasons/${id}`);
        toast({ title: 'Success', description: 'Peak season deleted.' });
        fetchPeakSeasons();
        fetchAvailability();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete peak season.', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/tenant/properties/${propertyId}/rooms`}
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Rooms
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Daily Availability & Pricing</CardTitle>
              <CardDescription>
                Room: <strong>{roomName || "Loading..."}</strong>
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAvailabilityDialogOpen(true)}>
              Set Availability
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AvailabilityCalendar
            basePrice={basePrice}
            availabilityData={availability}
            peakSeasons={peakSeasons}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onSave={handleSave}
          />
        </CardContent>
      </Card>

      <Separator className="max-w-4xl mx-auto" />

      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Peak Season Management</h2>
            <p className="text-muted-foreground">Define special pricing periods like holidays or events.</p>
          </div>
          <Button onClick={() => { setEditingSeason(null); setIsDialogOpen(true); }}>Add Peak Season</Button>
        </div>
        <PeakSeasonList
          seasons={peakSeasons}
          onEdit={(season) => { setEditingSeason(season); setIsDialogOpen(true); }}
          onDelete={handleDeletePeakSeason}
        />
      </div>

      <AvailabilityDialog
        isOpen={isAvailabilityDialogOpen}
        onClose={() => setIsAvailabilityDialogOpen(false)}
        onSave={handleSaveAvailability}
      />

      <PeakSeasonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePeakSeason}
        initialData={editingSeason}
      />
    </div>
  );
}