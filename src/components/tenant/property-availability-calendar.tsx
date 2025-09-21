import React from 'react';
import { format } from 'date-fns';
import { DayProps } from 'react-day-picker'; // Impor DayProps untuk tipe yang benar
import { Calendar } from '@/components/ui/calendar';
import { usePropertyAvailability } from '@/hooks/use-property-availability';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from 'lucide-react';

interface CalendarProps {
    propertyId: string;
    month: Date;
}

export const PropertyAvailabilityCalendar: React.FC<CalendarProps> = ({ propertyId, month }) => {

    const { data, isLoading, isError } = usePropertyAvailability(propertyId, month);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-80 w-full">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex items-center justify-center h-80 w-full bg-red-50 text-red-700 rounded-lg">
                <p>Gagal memuat data properti.</p>
            </div>
        );
    }

    function Day(props: DayProps) {
        const date = props.day.date;

        if (date.getMonth() !== month.getMonth()) {
            return <div />;
        }

        const dateString = format(date, 'yyyy-MM-dd');
        const dayData = data?.[dateString];
        const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={
                                `w-full h-full flex items-center justify-center rounded-md relative transition-colors
                                 ${isToday ? 'font-bold border-2 border-yellow-500' : ''}`
                            }
                        >
                            {format(date, 'd')}
                        </div>
                    </TooltipTrigger>
                    {dayData && (
                        <TooltipContent>
                            <p className="font-bold">{dayData.status.replace(/_/g, ' ')}</p>
                            <p>Kamar Tersedia: {dayData.availableCount} / {dayData.totalRooms}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Calendar
            month={month}
            modifiers={{
                fully_available: date => data?.[format(date, 'yyyy-MM-dd')]?.status === 'FULLY_AVAILABLE',
                partially_available: date => data?.[format(date, 'yyyy-MM-dd')]?.status === 'PARTIALLY_AVAILABLE',
                fully_booked: date => data?.[format(date, 'yyyy-MM-dd')]?.status === 'FULLY_BOOKED',
            }}
            modifiersClassNames={{
                fully_available: '!bg-green-100 text-green-900',
                partially_available: '!bg-yellow-100 text-yellow-900',
                fully_booked: '!bg-red-100 text-red-900',
            }}
            components={{
                Day: Day, // Menggunakan komponen Day kustom kita
            }}
            showOutsideDays={false}
            className="w-full"
        />
    );
};