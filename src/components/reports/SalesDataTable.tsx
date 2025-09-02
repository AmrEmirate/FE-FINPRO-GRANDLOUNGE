import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { SalesReportItem } from '@/app/tenant/reports/sales/page';

interface SalesDataTableProps {
    data: SalesReportItem[];
    groupBy: 'property' | 'user' | 'transaction';
}

export function SalesDataTable({ data, groupBy }: SalesDataTableProps) {
    const headerLabel = groupBy === 'property' ? 'Nama Properti' : 'Nama Pengguna';

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{headerLabel}</TableHead>
                    <TableHead className="text-right">Total Penjualan</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">
                            Rp {item.total.toLocaleString('id-ID')}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
