// src/app/tenant/properties/[propertyId]/availability/page.tsx
"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AvailabilityCalendar } from "@/components/tenant/availability-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data untuk simulasi
const mockRooms = [
    { id: "1", name: "Mountain View Suite", basePrice: 2500000 },
    { id: "2", name: "Family Room", basePrice: 1750000 },
];

const mockAvailability = [
    { date: "2025-10-10", isAvailable: true, price: 2700000 },
    { date: "2025-10-11", isAvailable: false },
];

export default function ManageAvailabilityPage() {
    const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // === PERBAIKAN DI SINI ===
    // Sesuaikan tipe data agar cocok dengan props onSave di AvailabilityCalendar
    const handleSave = (
        dates: DateRange,
        isAvailable: boolean,
        price?: number // Jadikan opsional dengan tanda tanya (?)
    ) => {
        // Karena 'dates' dijamin ada oleh komponen, kita bisa langsung menggunakannya
        // (Pengecekan 'from' dan 'to' tetap ide yang bagus)
        if (dates.from && dates.to) {
            alert(
                `Saved: ${dates.from.toDateString()} to ${dates.to.toDateString()}, Available: ${isAvailable}, Price: ${price || 'Not set' // Tampilkan jika harga ada
                }`
            );
        } else {
            alert("Something went wrong with the selected date range.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Manage Availability & Pricing</CardTitle>
                    <CardDescription>
                        Select a room and then click on dates to set custom prices or mark them as unavailable.
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
                            <SelectTrigger id="room-select">
                                <SelectValue placeholder="Select a room to manage" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockRooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>
                                        {room.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <AvailabilityCalendar
                        basePrice={selectedRoom.basePrice}
                        availabilityData={mockAvailability}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        onSave={handleSave}
                    />
                </CardContent>
            </Card>
        </div>
    );
}