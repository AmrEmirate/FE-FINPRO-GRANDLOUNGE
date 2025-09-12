// src/app/tenant/properties/[id]/availability/page.tsx

"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PeakSeasonDialog, PeakSeason, PeakSeasonPayload } from "@/components/tenant/PeakSeasonDialog";
import { PeakSeasonList } from "@/components/tenant/PeakSeasonList";
import { useToast } from "@/components/ui/use-toast";

// Mock data untuk simulasi
const mockRooms = [
    { id: "room_1", name: "Mountain View Suite", basePrice: 2500000 },
    { id: "room_2", name: "Family Room", basePrice: 1750000 },
];

const mockAvailability = [
    { date: new Date("2025-10-10").toISOString(), isAvailable: true, price: 2700000 },
    { date: new Date("2025-10-11").toISOString(), isAvailable: false },
];

const mockPeakSeasons: PeakSeason[] = [
    {
        id: 'ps1',
        name: 'New Year 2026',
        startDate: new Date('2025-12-28'),
        endDate: new Date('2026-01-05'),
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: 30,
    }
];

export default function ManageAvailabilityPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>(mockPeakSeasons);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSeason, setEditingSeason] = useState<PeakSeason | null>(null);

    // Fungsi ini akan dijalankan setelah operasi simpan/edit/hapus berhasil
    const handleSuccess = () => {
        console.log("Operation successful! Refetching data...");
        // Di aplikasi nyata, Anda akan memanggil fungsi refetch data dari hook Anda di sini
        toast({
            title: "Success",
            description: "Data has been updated successfully.",
        });
    };

    const handleSaveCalendar = (dates: DateRange, isAvailable: boolean, price?: number) => {
        console.log("Saving calendar data:", { dates, isAvailable, price });
        // Logika untuk menyimpan data kalender...
        handleSuccess();
    };

    const handleSavePeakSeason = (season: PeakSeasonPayload) => {
        console.log("Saving peak season for room:", selectedRoom.id, season);
        // Logika untuk menyimpan data peak season...
        if (season.id) {
            // Edit
            setPeakSeasons(prev => prev.map(s => s.id === season.id ? { ...s, ...season, id: s.id } as PeakSeason : s));
        } else {
            // Tambah baru
            setPeakSeasons(prev => [...prev, { ...season, id: `ps_${Date.now()}` } as PeakSeason]);
        }
        setIsDialogOpen(false);
        handleSuccess();
    };

    const handleDeletePeakSeason = (seasonId: string) => {
        console.log("Deleting peak season:", seasonId);
        // Logika untuk menghapus data peak season...
        setPeakSeasons(prev => prev.filter(s => s.id !== seasonId));
        handleSuccess();
    };
    
    const handleEditPeakSeason = (season: PeakSeason) => {
        setEditingSeason(season);
        setIsDialogOpen(true);
    };
    
    const openAddDialog = () => {
        setEditingSeason(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Manage Daily Availability & Pricing</CardTitle>
                    <CardDescription>
                        Select a room, then click and drag on dates to set custom prices or mark them as unavailable.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="room-select">Select a Room</Label>
                        <Select
                            defaultValue={selectedRoom.id}
                            onValueChange={(roomId) => {
                                const room = mockRooms.find(r => r.id === roomId);
                                if (room) setSelectedRoom(room);
                            }}
                        >
                            <SelectTrigger id="room-select"><SelectValue placeholder="Select a room" /></SelectTrigger>
                            <SelectContent>
                                {mockRooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AvailabilityCalendar
                        basePrice={selectedRoom.basePrice}
                        availabilityData={mockAvailability}
                        peakSeasons={peakSeasons}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        onSave={handleSaveCalendar}
                    />
                </CardContent>
            </Card>

            <Separator className="max-w-4xl mx-auto" />
            
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Peak Season Management</h2>
                        <p className="text-muted-foreground">Define special pricing periods like holidays or events.</p>
                    </div>
                    <Button onClick={openAddDialog}>Add Peak Season</Button>
                </div>
                <PeakSeasonList 
                    seasons={peakSeasons}
                    onEdit={handleEditPeakSeason}
                    onDelete={handleDeletePeakSeason}
                />
            </div>
            
            {/* --- PERBAIKAN DI SINI --- */}
            {/* Tambahkan props 'roomId' dan 'onSuccess' yang wajib ada */}
            <PeakSeasonDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSavePeakSeason}
                initialData={editingSeason}
                roomId={selectedRoom.id}
                onSuccess={handleSuccess}
            />
        </div>
    );
}