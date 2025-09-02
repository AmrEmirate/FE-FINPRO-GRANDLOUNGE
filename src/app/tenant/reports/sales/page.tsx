'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { SalesChart } from '@/components/reports/SalesChart';
import { SalesDataTable } from '@/components/reports/SalesDataTable';
import apiHelper from '@/lib/apiHelper';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface SalesReportItem {
    name: string;
    total: number;
}

// --- PENJELASAN 1: Definisikan tipe spesifik untuk groupBy ---
type GroupByOption = 'property' | 'user' | 'transaction';

export default function SalesReportPage() {
    const [reportData, setReportData] = useState<SalesReportItem[]>([]);
    const [totalSales, setTotalSales] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    // --- PENJELASAN 2: Gunakan tipe spesifik pada state ---
    const [groupBy, setGroupBy] = useState<GroupByOption>('property');
    const [sortBy, setSortBy] = useState('total-desc');

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateRange?.from) params.append('startDate', dateRange.from.toISOString());
            if (dateRange?.to) params.append('endDate', dateRange.to.toISOString());
            params.append('groupBy', groupBy);
            params.append('sortBy', sortBy);

            const response = await apiHelper.get(`/report/sales?${params.toString()}`);

            if (groupBy === 'transaction') {
                setTotalSales(response.data.data._sum.totalPrice || 0);
                setReportData([]);
            } else {
                setReportData(response.data.data);
                const total = response.data.data.reduce((sum: number, item: SalesReportItem) => sum + item.total, 0);
                setTotalSales(total);
            }

        } catch (error) {
            toast({
                title: 'Gagal Memuat Laporan',
                description: 'Terjadi kesalahan saat mengambil data laporan penjualan.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
                    <p className="text-gray-500">Analisis pendapatan berdasarkan properti, pengguna, atau transaksi.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    {/* --- PENJELASAN 3: Pastikan onValueChange di-handle dengan benar --- */}
                    <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupByOption)}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Kelompokkan berdasarkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="property">Properti</SelectItem>
                            <SelectItem value="user">Pengguna</SelectItem>
                            <SelectItem value="transaction">Total Transaksi</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Urutkan berdasarkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="total-desc">Total Penjualan (Tertinggi)</SelectItem>
                            <SelectItem value="total-asc">Total Penjualan (Terendah)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={fetchReport} disabled={isLoading} className="w-full md:w-auto">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Terapkan Filter
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Total Pendapatan</CardTitle>
                        <CardDescription>Berdasarkan filter yang dipilih</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-12 w-3/4" /> :
                            <p className="text-4xl font-bold">
                                Rp {totalSales.toLocaleString('id-ID')}
                            </p>
                        }
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Visualisasi Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-64 w-full" /> :
                            <SalesChart data={reportData} />
                        }
                    </CardContent>
                </Card>
            </div>

            {groupBy !== 'transaction' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Laporan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-40 w-full" /> :
                            <SalesDataTable data={reportData} groupBy={groupBy} />
                        }
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

