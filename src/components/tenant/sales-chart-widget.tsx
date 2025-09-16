'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/apiHelper';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils/format';

interface SalesData {
    date: string;
    total: number;
}

export function SalesChartWidget() {
    const [data, setData] = useState<SalesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // 1. Mengambil data dari endpoint baru yang aman
                const response = await api.get('/report/widgets');

                const salesDataFromApi = response.data.data.dailySales || [];

                // 2. Format data untuk chart
                const formattedData = salesDataFromApi.map((item: any) => ({
                    date: new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' }),
                    total: Number(item._sum.totalPrice) || 0,
                }));
                setData(formattedData);

            } catch (error) {
                console.error('Gagal mengambil data penjualan dashboard', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Sisa kode JSX di bawah ini tidak perlu diubah
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pendapatan 7 Hari Terakhir</CardTitle>
                <CardDescription>Grafik pendapatan kotor dari semua properti Anda.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                {isLoading ? (
                    <div className="h-[350px] flex items-center justify-center text-sm text-muted-foreground">Memuat data...</div>
                ) : data.length === 0 ? (
                    <div className="h-[350px] flex items-center justify-center text-sm text-muted-foreground">Belum ada data pendapatan.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatPrice(value, true)}`} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <p className="text-sm font-medium">{`Pendapatan: ${formatPrice(payload[0].value as number)}`}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}