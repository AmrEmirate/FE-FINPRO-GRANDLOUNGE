"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { Property, Room } from "@/lib/types";
import type { DateRange } from "react-day-picker";
import apiHelper from "@/lib/apiHelper";
import { RoomSelection } from "./room-selection";
import { BookingSidebar } from "./booking-sidebar";
import { PropertyAvailabilityCalendar } from "./property-availability-calendar";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

const PropertyMap = dynamic(
    () => import('./property-map').then(mod => mod.PropertyMap),
    {
        ssr: false,
        loading: () => <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg" />
    }
);

interface PropertyClientComponentProps {
    property: Property;
}

export function PropertyClientComponent({ property }: PropertyClientComponentProps) {
    // State untuk interaksi pengguna
    const [availableRooms, setAvailableRooms] = useState<Room[]>(property.rooms || []);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(property.rooms?.[0] || null);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

    // useEffect sekarang HANYA untuk mengambil data dinamis (ketersediaan kamar)
    useEffect(() => {
        const fetchAvailableRooms = async () => {
            if (selectedRange?.from && selectedRange?.to) {
                setIsCheckingAvailability(true);
                setAvailableRooms([]);
                setSelectedRoom(null);
                try {
                    const checkIn = format(selectedRange.from, "yyyy-MM-dd");
                    const checkOut = format(selectedRange.to, "yyyy-MM-dd");

                    const response = await apiHelper.get(
                        `/properties/${property.id}/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`
                    );

                    setAvailableRooms(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedRoom(response.data.data[0]);
                    }
                } catch (error) {
                    console.error("Failed to fetch available rooms:", error);
                    setAvailableRooms([]);
                } finally {
                    setIsCheckingAvailability(false);
                }
            }
        };
        fetchAvailableRooms();
    }, [selectedRange, property.id]);

    const latitude = property.city?.latitude ? parseFloat(String(property.city.latitude)) : null;
    const longitude = property.city?.longitude ? parseFloat(String(property.city.longitude)) : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
            <div className="lg:col-span-2 space-y-8">
                {latitude && longitude && (
                    <PropertyMap latitude={latitude} longitude={longitude} propertyName={property.name} />
                )}
                <PropertyAvailabilityCalendar
                    propertyId={property.id}
                    selectedRange={selectedRange}
                    onSelectRange={setSelectedRange}
                />
                {isCheckingAvailability && (
                    <div className="space-y-4 p-4 mt-8 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center">
                            <SkeletonLoader className="h-6 w-1/3" />
                            <SkeletonLoader className="h-6 w-1/4" />
                        </div>
                        <SkeletonLoader className="h-5 w-full" />
                    </div>
                )}

                {!isCheckingAvailability && (
                    <RoomSelection
                        rooms={availableRooms}
                        selectedRoomId={selectedRoom?.id || null}
                        onRoomSelect={setSelectedRoom}
                    />
                )}
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <BookingSidebar
                    propertyId={property.id}
                    selectedRoom={selectedRoom}
                    selectedRange={selectedRange}
                    onDateChange={setSelectedRange}
                />
            </div>
        </div>
    );
}
