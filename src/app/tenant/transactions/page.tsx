'use client';

import { TransactionsContent } from '@/components/tenant/transactions-table';
import { OngoingTransactionsSection } from '@/components/tenant/ongoing-transactions-section';

export default function TenantTransactionsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pusat Komando Transaksi</h1>

            <OngoingTransactionsSection />
            <TransactionsContent />
        </div>
    );
}