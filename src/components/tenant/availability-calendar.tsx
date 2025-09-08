"use client";

import { useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar"; 
import { format, parseISO, isSameDay } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import DayContentProps from 'react-day-picker';

// --- Tipe Data Props ---
interface AvailabilityCalendarProps {
    availability?: {
        date: string;
        isAvailable: boolean;
        price: number | null;
    }[];
    peakSeasons?: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
    }[];
}

// --- Komponen Kustom untuk Merender Isi Tanggal ---
// Dibuat sebagai komponen terpisah untuk kejelasan
function CustomDayContent(props: DayContentProps & { customProps: { availability: AvailabilityCalendarProps['availability'] } }) {
    const { availability } = props.customProps;
    const dayNumber = format(props.date, 'd');
    const dayAvailability = availability?.find(a => isSameDay(parseISO(a.date), props.date));

    if (dayAvailability?.isAvailable && dayAvailability.price) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full relative -top-1">
                <span className="text-sm">{dayNumber}</span>
                <Badge
                    variant="secondary"
                    className="text-[0.6rem] absolute bottom-0 px-1 py-0 bg-gray-200 text-gray-700"
                >
                    {new Intl.NumberFormat('id-ID').format(dayAvailability.price)}
                </Badge>
            </div>
        );
    }
    
    return <>{dayNumber}</>;
};

// --- Komponen Kalender Utama ---
export function AvailabilityCalendar({ availability = [], peakSeasons = [] }: AvailabilityCalendarProps) {
    const bookedDates = useMemo(() => availability.filter(a => !a.isAvailable).map(a => parseISO(a.date)), [availability]);
    const availableDates = useMemo(() => availability.filter(a => a.isAvailable).map(a => parseISO(a.date)), [availability]);

    const getPeakSeasonDates = () => {
        let dates: Date[] = [];
        peakSeasons?.forEach(season => {
            const start = season.startDate;
            const end = season.endDate;
            if (start instanceof Date && end instanceof Date && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
                let currentDate = new Date(start);
                while (currentDate <= end) {
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
        return dates;
    };
    const peakSeasonDates = useMemo(getPeakSeasonDates, [peakSeasons]);

    return (
        <Calendar
            locale={indonesiaLocale}
            numberOfMonths={2}
            className="p-3 border rounded-md w-full"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
            }}
            modifiers={{ booked: bookedDates, available: availableDates, peak: peakSeasonDates }}
            modifiersClassNames={{
                booked: 'rdp-day_booked',
                available: 'rdp-day_available',
                peak: 'rdp-day_peak',
            }}
            components={{
                DayContent: (props) => <CustomDayContent {...props} customProps={{ availability }} />
            }}
        />
    );
}