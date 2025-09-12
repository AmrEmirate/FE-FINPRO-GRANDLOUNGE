'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTenantProperties } from '@/hooks/use-tenant-properties';
import api from '@/utils/api';
import { Loader2, ChevronLeft, ChevronRight, Ban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Tipe data ini disesuaikan dengan logika Anda yang ada
interface Availability {
    date: string;
    isAvailable: boolean;
    price?: number;
}

interface PeakSeason {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    adjustmentType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NOMINAL';
    adjustmentValue: number;
}

export default function AvailabilityReportPage() {
    // ====================================================================
    // SEMUA LOGIKA ASLI ANDA DIpertahankan DI SINI, TANPA PERUBAHAN
    // ====================================================================
    const { properties: allProperties, isLoading: isLoadingProperties } = useTenantProperties();
    const { toast } = useToast();

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    const [availabilityData, setAvailabilityData] = useState<Availability[]>([]);
    const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>([]);

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
    const basePrice = selectedProperty?.rooms?.find(r => r.id === selectedRoomId)?.basePrice || 0;

    // ====================================================================
    // AKHIR DARI BLOK LOGIKA ASLI ANDA
    // ====================================================================


    // Fungsi pembantu untuk UI Kalender
    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    };

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // Membuat map untuk akses cepat data ketersediaan
        const availabilityMap = new Map(availabilityData.map(d => [format(new Date(d.date), 'yyyy-MM-dd'), d]));

        // Fungsi untuk menghitung harga final
        const calculateFinalPrice = (date: Date): number | null => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const availability = availabilityMap.get(dateKey);

            if (availability && !availability.isAvailable) return null; // Tidak tersedia

            // Cek harga override dari availability
            if (availability?.price) return availability.price;

            // Cek peak season
            for (const season of peakSeasons) {
                if (isWithinInterval(date, { start: season.startDate, end: season.endDate })) {
                    if (season.adjustmentType === 'NOMINAL') {
                        return basePrice + season.adjustmentValue;
                    }
                    if (season.adjustmentType === 'PERCENTAGE') {
                        return basePrice * (1 + season.adjustmentValue / 100);
                    }
                }
            }

            // Jika tidak ada override, gunakan base price
            return basePrice;
        };

        const firstDayOfWeek = monthStart.getDay();
        const leadingEmptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`empty-${i}`} />);

        return (
            <>
                <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-700 mb-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                        <div key={day} className="p-2 text-sm text-gray-500 font-bold">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {leadingEmptyDays}
                    {days.map(day => {
                        const finalPrice = calculateFinalPrice(day);
                        const isAvailable = finalPrice !== null;
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const availabilityInfo = availabilityMap.get(dateKey);
                        const isSpecialPrice = availabilityInfo?.price !== undefined;
                        const isPeakSeason = peakSeasons.some(s => isWithinInterval(day, { start: s.startDate, end: s.endDate }));

                        return (
                            <div key={dateKey}
                                className={cn(
                                    "flex flex-col h-24 p-2 border rounded-lg text-sm transition-all duration-200",
                                    {
                                        "bg-white text-gray-900 border-gray-200": isAvailable,
                                        "bg-gray-100 text-gray-400 border-gray-200 line-through": !isAvailable,
                                        "border-yellow-400 border-2": isPeakSeason && isAvailable && !isSpecialPrice,
                                        "border-blue-500 border-2": isSpecialPrice && isAvailable
                                    }
                                )}
                            >
                                <span className="font-bold text-lg">{format(day, 'd')}</span>
                                {isAvailable ? (
                                    <div className="mt-auto w-full">
                                        <Badge variant={isSpecialPrice || isPeakSeason ? "default" : "secondary"} className="h-auto px-1 leading-tight">
                                            {finalPrice?.toLocaleString('id-ID')}
                                        </Badge>
                                    </div>
                                ) : (
                                    <div className="mt-auto w-full">
                                        <Badge variant="destructive" className="h-auto px-1 leading-tight">
                                            Unavailable
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    // ====================================================================
    // INI ADALAH BAGIAN UI YANG BARU (BLOK JSX RETURN)
    // ====================================================================
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Laporan Ketersediaan</h1>
                <p className="text-gray-600">Lihat ketersediaan kamar properti Anda dalam tampilan kalender.</p>
            </div>

            <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800">Filter</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col md:flex-row gap-4">
                    {isLoadingProperties ? <Skeleton className="h-11 w-full md:w-[250px]" /> : (
                        <Select onValueChange={handlePropertyChange} value={selectedPropertyId || ''} disabled={allProperties.length === 0}>
                            <SelectTrigger className="w-full md:w-[250px] h-11 bg-gray-50 border-gray-300 text-gray-700">
                                <SelectValue placeholder="Pilih Properti" />
                            </SelectTrigger>
                            <SelectContent>
                                {allProperties.map(property => (
                                    <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {selectedPropertyId && (
                        isLoadingProperties ? <Skeleton className="h-11 w-full md:w-[250px]" /> : (
                            <Select onValueChange={setSelectedRoomId} value={selectedRoomId || ''} disabled={rooms.length === 0}>
                                <SelectTrigger className="w-full md:w-[250px] h-11 bg-gray-50 border-gray-300 text-gray-700">
                                    <SelectValue placeholder="Pilih Kamar" />
                                </SelectTrigger>
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

            <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
                <CardHeader className="p-0 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-semibold text-gray-800">Kalender Ketersediaan</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                            Tanggal yang ditandai adalah tanggal yang sudah dipesan atau tidak tersedia.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 self-start md:self-center">
                        <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold text-lg text-gray-800 w-36 text-center">
                            {format(currentMonth, 'MMMM yyyy', { locale: id })}
                        </span>
                        <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingData ? (
                        <div className="flex items-center justify-center h-80 w-full">
                            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            <span className="ml-3 text-gray-600">Memuat data kalender...</span>
                        </div>
                    ) : selectedPropertyId && selectedRoomId ? (
                        renderCalendar()
                    ) : (
                        <div className="flex items-center justify-center h-80 w-full bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Pilih properti dan kamar untuk melihat ketersediaan.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
//kelebihan