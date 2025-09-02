'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { SalesReportItem } from '@/app/tenant/reports/sales/page';

interface SalesChartProps {
    data: SalesReportItem[];
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
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
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
