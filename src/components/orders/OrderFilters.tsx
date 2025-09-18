'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/home/date-picker';

interface OrderFiltersProps {
    filters: {
        search: string;
        property: string;
        date: Date | undefined;
    };
    setFilters: {
        setSearch: (value: string) => void;
        setProperty: (value: string) => void;
        setDate: (date: Date | undefined) => void;
    };
    onSearch: () => void;
    onReset: () => void;
}

export default function OrderFilters({ filters, setFilters, onSearch, onReset }: OrderFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <Input
                    placeholder="Cari berdasarkan Invoice Number dan No. Orders..."
                    value={filters.search}
                    onChange={(e) => setFilters.setSearch(e.target.value)}
                    className="flex-1"
                />
                <Input
                    placeholder="Cari nama properti..."
                    value={filters.property}
                    onChange={(e) => setFilters.setProperty(e.target.value)}
                    className="flex-1"
                />
                <div className="flex-1 w-full md:w-auto">
                    <DatePicker
                        selected={filters.date}
                        onSelect={setFilters.setDate}
                        placeholder="Pilih tanggal check-in"
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={onSearch} className="bg-gray-800 text-white">
                        Cari
                    </Button>
                    <Button onClick={onReset} variant="outline">
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}