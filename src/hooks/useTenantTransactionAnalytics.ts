'use client';

import { useMemo } from 'react';
import { TenantTransaction } from './useTenantTransactions'; // Impor tipe data

// PASTIKAN FUNGSI INI DIEKSPOR DENGAN BENAR
export const useTenantTransactionAnalytics = (transactions: TenantTransaction[]) => {
    const analytics = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return {
                totalRevenue: 0,
                completedTransactions: 0,
                pendingTransactions: 0,
                topProperty: 'N/A',
            };
        }

        const totalRevenue = transactions
            .filter(trx => trx.status === 'SELESAI')
            .reduce((sum, trx) => sum + trx.totalPrice, 0);

        const completedTransactions = transactions.filter(
            trx => trx.status === 'SELESAI'
        ).length;

        const pendingTransactions = transactions.filter(
            trx => trx.status === 'MENUNGGU_KONFIRMASI'
        ).length;

        const propertyCounts = transactions.reduce((acc, trx) => {
            const propName = trx.property.name;
            acc[propName] = (acc[propName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topProperty = Object.keys(propertyCounts).reduce(
            (a, b) => (propertyCounts[a] > propertyCounts[b] ? a : b),
            'N/A'
        );

        return {
            totalRevenue,
            completedTransactions,
            pendingTransactions,
            topProperty,
        };
    }, [transactions]);

    return analytics;
};