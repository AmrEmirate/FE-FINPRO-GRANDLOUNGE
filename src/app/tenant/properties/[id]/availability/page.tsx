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

// Import komponen baru
import { PeakSeasonDialog, PeakSeason } from "@/components/tenant/PeakSeasonDialog";
import { PeakSeasonList } from "@/components/tenant/PeakSeasonList";

// Mock data untuk simulasi
const mockRooms = [
    { id: "1", name: "Mountain View Suite", basePrice: 2500000 },
    { id: "2", name: "Family Room", basePrice: 1750000 },
];

const mockAvailability = [
    { date: "2025-10-10", isAvailable: true, price: 2700000 },
    { date: "2025-10-11", isAvailable: false },
];

// Mock data untuk Peak Seasons
const mockPeakSeasons: PeakSeason[] = [
    {
        id: 'ps1',
        name: 'New Year 2026',
        dateRange: { from: new Date('2025-12-28'), to: new Date('2026-01-05') },
        adjustmentType: 'percentage',
        adjustmentValue: 30,
    }
];

export default function ManageAvailabilityPage({ params }: { params: { id: string } }) {
    const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // State untuk Peak Season
    const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>(mockPeakSeasons);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSeason, setEditingSeason] = useState<PeakSeason | null>(null);

    const handleSaveCalendar = (dates: DateRange, isAvailable: boolean, price?: number) => {
        if (dates.from && dates.to) {
            alert(
                `Saved for Room ID ${selectedRoom.id}:\n` +
                `Dates: ${dates.from.toDateString()} to ${dates.to.toDateString()}\n` +
                `Available: ${isAvailable}\n` +
                `Price: ${price || 'Not set'}`
            );
        } else {
            alert("Something went wrong with the selected date range.");
        }
    };

    // Fungsi untuk menyimpan Peak Season
    const handleSavePeakSeason = (season: PeakSeason) => {
        setPeakSeasons(prev => {
            const existing = prev.find(s => s.id === season.id);
            if (existing) {
                // Update
                return prev.map(s => s.id === season.id ? season : s);
            } else {
                // Tambah baru
                return [...prev, season];
            }
        });
        setEditingSeason(null);
    };

    // Fungsi untuk menghapus Peak Season
    const handleDeletePeakSeason = (seasonId: string) => {
        if(confirm('Are you sure you want to delete this peak season?')) {
            setPeakSeasons(prev => prev.filter(s => s.id !== seasonId));
        }
    };
    
    // Fungsi untuk membuka dialog dalam mode edit
    const handleEditPeakSeason = (season: PeakSeason) => {
        setEditingSeason(season);
        setIsDialogOpen(true);
    };
    
    // Fungsi untuk membuka dialog dalam mode tambah baru
    const openAddDialog = () => {
        setEditingSeason(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-8">
            {/* Bagian Kalender */}
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
                            <SelectTrigger id="room-select"><SelectValue /></SelectTrigger>
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
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        onSave={handleSaveCalendar}
                    />
                </CardContent>
            </Card>

            <Separator className="max-w-4xl mx-auto" />
            
            {/* Bagian Peak Season */}
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex justify-between items-center">
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
            
            {/* Dialog untuk Tambah/Edit */}
            <PeakSeasonDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSavePeakSeason}
                initialData={editingSeason}
            />
        </div>
    );
}