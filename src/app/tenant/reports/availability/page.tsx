"use client";

import { useState } from "react";
import { useTenantProperties } from "@/hooks/use-tenant-properties";
import { useTenantRooms } from "@/hooks/use-tenant-rooms";
import { useAvailabilityManager } from "@/hooks/use-availability-manager";
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building, DoorOpen, CalendarSearch } from "lucide-react";

function AvailabilityView({ propertyId, roomId }: { propertyId: string; roomId: string }) {
    const {
        room,
        availability,
        peakSeasons,
        isLoading,
        error,
        currentMonth,
        setCurrentMonth,
        handleSaveAvailability,
    } = useAvailabilityManager(propertyId, roomId);

    if (isLoading) {
        return (
            <div className="mt-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="w-full h-[400px]" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="destructive" className="mt-6">
            <AlertTitle>Gagal Memuat Data</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
        </Alert>
    }

    return (
        <div className="mt-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Kalender Ketersediaan Kamar</CardTitle>
                <CardDescription>
                    Status untuk kamar: <strong>{room?.name || "Memuat..."}</strong>
                </CardDescription>
            </CardHeader>
            <AvailabilityCalendar
                basePrice={room?.basePrice || 0}
                availabilityData={availability}
                peakSeasons={peakSeasons}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                onSave={handleSaveAvailability}
            />
        </div>
    );
}

export default function TenantAvailabilityReportPage() {
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    const { properties, isLoading: isLoadingProperties } = useTenantProperties();

    const { rooms, isLoading: isLoadingRooms } = useTenantRooms(selectedPropertyId);

    const handlePropertyChange = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
        setSelectedRoomId(null); 
    };

    const handleRoomChange = (roomId: string) => {
        setSelectedRoomId(roomId);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Laporan Ketersediaan</CardTitle>
                    <CardDescription>Pilih properti dan kamar untuk melihat kalender ketersediaan detail.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* --- Pilihan Properti --- */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Properti</label>
                            <Select onValueChange={handlePropertyChange} disabled={isLoadingProperties} value={selectedPropertyId || ""}>
                                <SelectTrigger>
                                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder={isLoadingProperties ? "Memuat properti..." : "Pilih Properti"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {properties?.map((prop) => (
                                        <SelectItem key={prop.id} value={prop.id}>
                                            {prop.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kamar</label>
                            <Select
                                onValueChange={handleRoomChange}
                                disabled={!selectedPropertyId || isLoadingRooms}
                                value={selectedRoomId || ""}
                            >
                                <SelectTrigger>
                                    <DoorOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder={
                                        isLoadingRooms ? "Memuat kamar..." :
                                            !selectedPropertyId ? "Pilih properti dulu" : "Pilih Kamar"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms?.map((room) => (
                                        <SelectItem key={room.id} value={room.id}>
                                            {room.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* --- Tampilan Kalender (muncul setelah memilih kamar) --- */}
                    {selectedPropertyId && selectedRoomId ? (
                        <AvailabilityView propertyId={selectedPropertyId} roomId={selectedRoomId} />
                    ) : (
                        <div className="text-center py-16 text-muted-foreground bg-gray-50 rounded-lg mt-8">
                            <CalendarSearch className="h-12 w-12 mx-auto mb-4" />
                            <p>Silakan pilih properti dan kamar untuk menampilkan kalender.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}