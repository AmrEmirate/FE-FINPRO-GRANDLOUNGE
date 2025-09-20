// src/app/tenant/properties/[id]/availability/page.tsx

"use client";

import { useManageAvailability } from "@/hooks/use-manage-availability";
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar";
import { PeakSeasonDialog } from "@/components/tenant/PeakSeasonDialog";
import { PeakSeasonList } from "@/components/tenant/PeakSeasonList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

function PeakSeasonManager({ seasons, onAdd, onEdit, onDelete }: any) {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Peak Season Management</h2>
                    <p className="text-muted-foreground">Define special pricing periods like holidays or events.</p>
                </div>
                <Button onClick={onAdd}>Add Peak Season</Button>
            </div>
            <PeakSeasonList seasons={seasons} onEdit={onEdit} onDelete={onDelete} />
        </div>
    );
}

export default function ManageAvailabilityPage({ params }: { params: { id: string } }) {
    const {
        rooms,
        selectedRoom,
        setSelectedRoom,
        peakSeasons,
        isLoading,
        isDialogOpen,
        setIsDialogOpen,
        editingSeason,
        handleSavePeakSeason,
        handleDeletePeakSeason,
        handleEditPeakSeason,
        openAddDialog,
        handleSuccess,
    } = useManageAvailability(params.id); // 'params.id' sekarang digunakan

    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (isLoading) {
        return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Manage Daily Availability & Pricing</CardTitle>
                    <CardDescription>
                        Select a room, then click and drag dates to set custom prices or mark them as unavailable.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="room-select">Select a Room</Label>
                        <Select
                            value={selectedRoom?.id}
                            onValueChange={(roomId) => {
                                const room = rooms.find(r => r.id === roomId);
                                if (room) setSelectedRoom(room);
                            }}
                        >
                            <SelectTrigger id="room-select">
                                <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedRoom && (
                        <AvailabilityCalendar
                            basePrice={selectedRoom.basePrice}
                            availabilityData={[]} // Ganti dengan data nyata dari API
                            peakSeasons={peakSeasons}
                            currentMonth={currentMonth}
                            onMonthChange={setCurrentMonth}
                            onSave={() => handleSuccess("Calendar data saved.")}
                        />
                    )}
                </CardContent>
            </Card>

            <Separator className="max-w-4xl mx-auto" />

            <PeakSeasonManager
                seasons={peakSeasons}
                onAdd={openAddDialog}
                onEdit={handleEditPeakSeason}
                onDelete={handleDeletePeakSeason}
            />
            
            {selectedRoom && (
                <PeakSeasonDialog 
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleSavePeakSeason}
                    initialData={editingSeason}
                    roomId={selectedRoom.id} // roomId wajib ada
                    onSuccess={() => {}} // onSuccess bisa dikosongkan jika sudah ditangani di hook
                />
            )}
        </div>
    );
}