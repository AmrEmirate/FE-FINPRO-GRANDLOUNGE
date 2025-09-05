'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTenantProperties } from '@/hooks/use-tenant-properties';
import api from '@/utils/api';
import { AvailabilityCalendar } from '@/components/tenant/availability-calendar';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Property } from '@/lib/types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface BookedDate {
    roomId: string;
    checkIn: string;
    checkOut: string;
}

export default function AvailabilityReportPage() {
    const { properties: allProperties, isLoading: isLoadingProperties } = useTenantProperties();
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
    const [isLoadingBookedDates, setIsLoadingBookedDates] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!isLoadingProperties && allProperties.length > 0 && !selectedPropertyId) {
            const firstProperty = allProperties[0];
            setSelectedPropertyId(firstProperty.id);
            if (firstProperty.rooms && firstProperty.rooms.length > 0) {
                setSelectedRoomId(firstProperty.rooms[0].id);
            }
        }
    }, [isLoadingProperties, allProperties, selectedPropertyId]);

    const fetchBookedDates = useCallback(async () => {
        if (!selectedPropertyId || !selectedRoomId) {
            setBookedDates([]);
            return;
        }

        setIsLoadingBookedDates(true);
        try {
            // **PERBAIKAN UTAMA: Selalu kirim startDate dan endDate**
            const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

            const response = await api.get(`/calendar-report/${selectedPropertyId}/${selectedRoomId}`, {
                params: { startDate, endDate }
            });
            setBookedDates(response.data.data);
        } catch (error) {
            toast({
                title: 'Gagal mengambil data ketersediaan.',
                variant: 'destructive',
            });
            console.error('Error fetching booked dates:', error);
            setBookedDates([]);
        } finally {
            setIsLoadingBookedDates(false);
        }
    }, [selectedPropertyId, selectedRoomId, toast]);

    useEffect(() => {
        fetchBookedDates();
    }, [fetchBookedDates]);

    const handlePropertyChange = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
        const selectedProperty = allProperties.find(p => p.id === propertyId);
        if (selectedProperty?.rooms && selectedProperty.rooms.length > 0) {
            setSelectedRoomId(selectedProperty.rooms[0].id);
        } else {
            setSelectedRoomId(null);
        }
    };

    const selectedProperty = allProperties.find(p => p.id === selectedPropertyId);
    const rooms = selectedProperty?.rooms || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Laporan Ketersediaan Properti</h1>
            <p className="text-gray-500">Lihat ketersediaan kamar properti Anda dalam tampilan kalender.</p>

            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    {isLoadingProperties ? (
                        <Skeleton className="h-10 w-full md:w-[250px]" />
                    ) : (
                        <Select
                            onValueChange={handlePropertyChange}
                            value={selectedPropertyId || ''}
                            disabled={allProperties.length === 0}
                        >
                            <SelectTrigger className="w-full md:w-[250px]">
                                <SelectValue placeholder="Pilih Properti" />
                            </SelectTrigger>
                            <SelectContent>
                                {allProperties.map(property => (
                                    <SelectItem key={property.id} value={property.id}>
                                        {property.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {selectedPropertyId && (
                        isLoadingProperties ? (
                            <Skeleton className="h-10 w-full md:w-[250px]" />
                        ) : (
                            <Select
                                onValueChange={setSelectedRoomId}
                                value={selectedRoomId || ''}
                                disabled={rooms.length === 0}
                            >
                                <SelectTrigger className="w-full md:w-[250px]">
                                    <SelectValue placeholder="Pilih Kamar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.length > 0 ? (
                                        rooms.map(room => (
                                            <SelectItem key={room.id} value={room.id}>
                                                Kamar {room.roomNumber}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-rooms" disabled>Tidak ada kamar tersedia</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tampilan Kalender Ketersediaan</CardTitle>
                    <CardDescription>Tanggal yang ditandai adalah tanggal yang sudah dipesan.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                    {isLoadingBookedDates ? (
                        <div className="flex items-center justify-center h-80 w-full">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : selectedPropertyId && selectedRoomId ? (
                        <AvailabilityCalendar bookedDates={bookedDates} />
                    ) : (
                        <p className="text-gray-500">Pilih properti dan kamar untuk melihat ketersediaan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}