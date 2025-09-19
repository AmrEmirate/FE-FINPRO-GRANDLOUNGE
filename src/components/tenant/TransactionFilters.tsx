// src/components/tenant/TransactionFilters.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    checkInDate: Date | undefined;
    setCheckInDate: (date: Date | undefined) => void;
    onReset: () => void;
    onSearch: () => void; // Tambahkan prop untuk tombol Cari
}

export const TransactionFilters = ({
    searchQuery,
    setSearchQuery,
    checkInDate,
    setCheckInDate,
    onReset,
    onSearch,
}: TransactionFiltersProps) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 border rounded-lg bg-card">
            <div className="relative w-full flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari user, pesanan, properti..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className="w-full md:w-[240px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, 'PPP') : <span>Pilih tanggal check-in</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Button onClick={onSearch} className='bg-gray-900'>
                <Search className="mr-2 h-4 w-4" />
                Cari
            </Button>
            <Button onClick={onReset} variant="ghost" className='bg-red-500 text-white hover:bg-red-700 hover:text-white'>
                <X className="mr-2 h-4 w-4 text-white" />
                Reset
            </Button>
        </div>
    );
};