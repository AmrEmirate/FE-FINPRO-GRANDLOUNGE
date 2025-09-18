'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/home/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property } from '@/lib/types';

interface TransactionFiltersProps {
    filters: {
        search: string;
        property: string;
        date: Date | undefined;
        status: string;
    };
    setFilters: {
        setSearch: (value: string) => void;
        setProperty: (value: string) => void;
        setDate: (date: Date | undefined) => void;
        setStatus: (value: string) => void;
    };
    properties: Property[];
    onReset: () => void;
}

export default function TransactionFilters({ filters, setFilters, properties, onReset }: TransactionFiltersProps) {
    const bookingStatuses = ["DIPROSES", "SELESAI", "DIBATALKAN", "MENUNGGU_PEMBAYARAN", "MENUNGGU_KONFIRMASI"];

    return (
        <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                <Input
                    placeholder="Cari Invoice, No. Pesanan, Nama Tamu..."
                    value={filters.search}
                    onChange={(e) => setFilters.setSearch(e.target.value)}
                    className="lg:col-span-2"
                />
                <Select value={filters.property} onValueChange={setFilters.setProperty}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua Properti" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* 🛠️ PERBAIKAN: Hapus SelectItem dengan value="" */}
                        {/* Cukup tampilkan daftar properti. Placeholder akan muncul otomatis. */}
                        {properties.map(prop => (
                            <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DatePicker
                    selected={filters.date}
                    onSelect={setFilters.setDate}
                    placeholder="Pilih tanggal check-in"
                />
                <div className="flex gap-2">
                    <Button onClick={onReset} variant="outline" className="w-full">Reset</Button>
                </div>
            </CardContent>
        </Card>
    );
}