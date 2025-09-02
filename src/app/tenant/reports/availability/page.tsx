'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import apiHelper from '@/lib/apiHelper';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { Property } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { DayProps } from 'react-day-picker';

interface AvailabilityData {
    [date: string]: {
        bookings: number;
        available: number;
    };
}

export default function AvailabilityReportPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [month, setMonth] = useState(new Date());
    const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({});
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await apiHelper.get('/properties/my-properties/all');
                setProperties(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedProperty(response.data.data[0].id);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                toast({ title: 'Gagal memuat properti', variant: 'destructive' });
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, [toast]);

    const fetchAvailability = useCallback(async () => {
        if (!selectedProperty) return;
        setIsLoading(true);
        try {
            const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(month), 'yyyy-MM-dd');

            const response = await apiHelper.get(
                `/calender/calender?propertyId=${selectedProperty}&startDate=${startDate}&endDate=${endDate}`
            );

            const processedData: AvailabilityData = {};
            for (const [date, records] of Object.entries(response.data.data)) {
                let availableCount = 0;
                const totalRooms = new Set((records as any[]).map(r => r.roomId)).size;
                (records as any[]).forEach(rec => {
                    if (rec.isAvailable) {
                        availableCount++;
                    }
                });
                processedData[date] = {
                    bookings: totalRooms - availableCount,
                    available: availableCount
                };
            }
            setAvailabilityData(processedData);
        } catch (error) {
            toast({ title: 'Gagal memuat data ketersediaan', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [selectedProperty, month, toast]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    const CustomDayComponent = (props: DayProps) => {
        const dateString = format(props.day.date, 'yyyy-MM-dd');
        const data = availabilityData[dateString];

        return (
            <div className="relative h-24 w-full flex flex-col items-center justify-center border-t first:border-l p-1 text-xs">
                <span className="absolute top-1 right-1">{format(props.day.date, 'd')}</span>
                {data && (
                    <div className="text-center mt-2 space-y-1">
                        <Badge variant={data.available > 0 ? 'default' : 'destructive'} className="w-full justify-center">
                            {data.available} Tersedia
                        </Badge>
                        <Badge variant="secondary" className="w-full justify-center">
                            {data.bookings} Dipesan
                        </Badge>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Laporan Ketersediaan Properti</h1>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                            <SelectTrigger className="w-full md:w-[250px]">
                                <SelectValue placeholder="Pilih Properti" />
                            </SelectTrigger>
                            <SelectContent>
                                {properties.map((prop) => (
                                    <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                    {!isLoading && properties.length > 0 && (
                        <Calendar
                            month={month}
                            onMonthChange={setMonth}
                            className="p-0 border rounded-md"
                            classNames={{
                                day: 'h-24 w-full',
                                cell: 'p-0',
                            }}
                            components={{
                                Day: CustomDayComponent,
                            }}
                        />
                    )}
                    {!isLoading && properties.length === 0 && (
                        <div className="text-center h-96 flex items-center justify-center">
                            <p>Anda belum memiliki properti. Silakan tambahkan properti terlebih dahulu.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}