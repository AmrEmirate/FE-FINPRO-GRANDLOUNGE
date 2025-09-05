// src/app/tenant/reports/availability/page.tsx

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

export default function AvailabilityReportPage() {
    const { properties: allProperties, isLoading: isLoadingProperties } = useTenantProperties();
    const { toast } = useToast();

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    
    const [availabilityData, setAvailabilityData] = useState<any[]>([]);
    const [peakSeasons, setPeakSeasons] = useState<any[]>([]);
    
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        if (!isLoadingProperties && allProperties.length > 0 && !selectedPropertyId) {
            const firstProperty = allProperties[0];
            setSelectedPropertyId(firstProperty.id);
            if (firstProperty.rooms && firstProperty.rooms.length > 0) {
                setSelectedRoomId(firstProperty.rooms[0].id);
            }
        }
    }, [isLoadingProperties, allProperties, selectedPropertyId]);

    const fetchCalendarData = useCallback(async (month: Date) => {
        if (!selectedPropertyId || !selectedRoomId) {
            setAvailabilityData([]);
            setPeakSeasons([]);
            return;
        }

        setIsLoadingData(true);
        try {
            const availabilityRes = await api.get(`/properties/my-properties/${selectedPropertyId}/rooms/${selectedRoomId}/availability-by-month`, {
                params: { 
                    month: month.getMonth() + 1,
                    year: month.getFullYear()
                }
            });
            setAvailabilityData(availabilityRes.data.data || []);

            const peakSeasonRes = await api.get(`/peak-seasons/by-room/${selectedRoomId}`);
            setPeakSeasons(peakSeasonRes.data.data.map((s: any) => ({
                ...s,
                startDate: new Date(s.startDate),
                endDate: new Date(s.endDate),
            })) || []);

        } catch (error) {
            toast({
                title: 'Gagal mengambil data kalender.',
                description: 'Terjadi kesalahan saat berkomunikasi dengan server.',
                variant: 'destructive',
            });
            setAvailabilityData([]);
            setPeakSeasons([]);
        } finally {
            setIsLoadingData(false);
        }
    }, [selectedPropertyId, selectedRoomId, toast]);

    useEffect(() => {
        fetchCalendarData(currentMonth);
    }, [fetchCalendarData, currentMonth]);

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
            <h1 className="text-2xl font-bold">Laporan Ketersediaan</h1>
            <p className="text-gray-500">Lihat ketersediaan kamar properti Anda dalam tampilan kalender.</p>

            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    {isLoadingProperties ? <Skeleton className="h-10 w-full md:w-[250px]" /> : (
                        <Select onValueChange={handlePropertyChange} value={selectedPropertyId || ''} disabled={allProperties.length === 0}>
                            <SelectTrigger className="w-full md:w-[250px]"><SelectValue placeholder="Pilih Properti" /></SelectTrigger>
                            <SelectContent>
                                {allProperties.map(property => (
                                    <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {selectedPropertyId && (
                        isLoadingProperties ? <Skeleton className="h-10 w-full md:w-[250px]" /> : (
                            <Select onValueChange={setSelectedRoomId} value={selectedRoomId || ''} disabled={rooms.length === 0}>
                                <SelectTrigger className="w-full md:w-[250px]"><SelectValue placeholder="Pilih Kamar" /></SelectTrigger>
                                <SelectContent>
                                    {rooms.length > 0 ? (
                                        rooms.map(room => (
                                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-rooms" disabled>Tidak ada kamar</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Kalender Ketersediaan</CardTitle>
                    <CardDescription>Tanggal yang ditandai adalah tanggal yang sudah dipesan atau tidak tersedia.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                    {isLoadingData ? (
                        <div className="flex items-center justify-center h-80 w-full">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : selectedPropertyId && selectedRoomId ? (
                        <AvailabilityCalendar 
                            basePrice={selectedProperty?.rooms?.find(r => r.id === selectedRoomId)?.basePrice || 0}
                            availabilityData={availabilityData}
                            peakSeasons={peakSeasons}
                            currentMonth={currentMonth}
                            onMonthChange={setCurrentMonth}
                            onSave={() => {}}
                        />
                    ) : (
                        <p className="text-gray-500">Pilih properti dan kamar untuk melihat ketersediaan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}