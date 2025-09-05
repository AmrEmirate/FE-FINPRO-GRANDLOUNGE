// src/app/tenant/reports/availability/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTenantProperties } from '@/hooks/use-tenant-properties';
import api from '@/utils/api';
import { Loader2, CalendarX2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface BookedDate {
    roomId: string;
    checkIn: string;
    checkOut: string;
}

export default function AvailabilityReportPage() {
    const { properties: allProperties, isLoading: isLoadingProperties } = useTenantProperties();
    const { toast } = useToast();

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
    const [isLoadingBookedDates, setIsLoadingBookedDates] = useState(false);

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
            const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
            const response = await api.get(`/calendar-report/${selectedPropertyId}/${selectedRoomId}`, {
                params: { startDate, endDate }
            });
            setBookedDates(response.data.data || []);
        } catch (error) {
            toast({
                title: 'Gagal mengambil data ketersediaan.',
                variant: 'destructive',
            });
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
            <h1 className="text-2xl font-bold">Laporan Ketersediaan</h1>
            <p className="text-gray-500">Lihat ketersediaan kamar properti Anda.</p>

            {/* Selector Properti dan Kamar (tidak berubah) */}
            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    {isLoadingProperties ? <Skeleton className="h-10 w-full md:w-[250px]" /> : (
                        <Select onValueChange={handlePropertyChange} value={selectedPropertyId || ''}>
                            <SelectTrigger className="w-full md:w-[250px]"><SelectValue placeholder="Pilih Properti" /></SelectTrigger>
                            <SelectContent>{allProperties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                    {selectedPropertyId && (
                        isLoadingProperties ? <Skeleton className="h-10 w-full md:w-[250px]" /> : (
                            <Select onValueChange={setSelectedRoomId} value={selectedRoomId || ''}>
                                <SelectTrigger className="w-full md:w-[250px]"><SelectValue placeholder="Pilih Kamar" /></SelectTrigger>
                                <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                            </Select>
                        )
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tampilan Kalender Ketersediaan</CardTitle>
                    <CardDescription>Tanggal yang sudah dipesan akan ditampilkan di sini.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6 min-h-[300px] items-center">
                    {isLoadingBookedDates ? (
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    ) : selectedPropertyId && selectedRoomId ? (
                        // --- PERUBAHAN UTAMA: Menampilkan pesan, bukan kalender ---
                        <div className="text-center text-gray-500">
                            <CalendarX2 className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">Tampilan Kalender Laporan Tidak Tersedia</p>
                            <p className="text-sm">Komponen kalender saat ini hanya mendukung mode manajemen.</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">Pilih properti dan kamar untuk melihat ketersediaan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}