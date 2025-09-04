'use client';

import { TransactionsTable } from '@/components/tenant/transactions-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TenantTransactionsPage() {
  const statusTabs = [
    { value: '', label: 'Semua' },
    { value: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Pembayaran' },
    { value: 'DIKONFIRMASI', label: 'Dikonfirmasi' },
    { value: 'SELESAI', label: 'Selesai' },
    { value: 'DIBATALKAN', label: 'Dibatalkan' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Daftar Transaksi</h1>

      <Tabs defaultValue="" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label} Transaksi</CardTitle>
                <CardDescription>
                  Daftar semua transaksi dengan status {tab.label.toLowerCase()}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Komponen tabel akan menerima status sebagai prop */}
                <TransactionsTable status={tab.value} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}