'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { SalesReportItem } from '@/app/tenant/reports/sales/page';

interface SalesChartProps {
    data: SalesReportItem[];
}

// Ganti nama komponen menjadi SalesChart agar sesuai dengan pemanggilan
export default function SalesChart({ data }: SalesChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name" // Gunakan 'name' sesuai tipe data SalesReportItem
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp${new Intl.NumberFormat('id-ID').format(value as number)}`}
                />
                <Tooltip
                    formatter={(value) => [`Rp${new Intl.NumberFormat('id-ID').format(value as number)}`, 'Total']}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                />
                {/* --- PERBAIKAN DI SINI --- */}
                <Bar
                    dataKey="total"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary" // Gunakan className untuk mengisi warna
                />
                {/* ------------------------- */}
            </BarChart>
        </ResponsiveContainer>
    );
}