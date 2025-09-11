'use client';

import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

interface CountdownTimerProps {
    expiryTimestamp: string;
    onTimerEnd: () => void;
}

export const CountdownTimer = ({ expiryTimestamp, onTimerEnd }: CountdownTimerProps) => {
    const calculateRemainingTime = useCallback(() => {
        const expiryTime = new Date(expiryTimestamp).getTime();
        const now = new Date().getTime();
        // Langsung hitung selisih dari waktu sekarang ke waktu deadline
        return Math.max(0, expiryTime - now);
    }, [expiryTimestamp]);

    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemainingTime = calculateRemainingTime();
            setRemainingTime(newRemainingTime);

            if (newRemainingTime <= 0) {
                clearInterval(interval);
                onTimerEnd();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateRemainingTime, onTimerEnd]);

    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    // Jangan tampilkan apapun jika waktu sudah habis
    if (remainingTime <= 0) return null;

    return (
        <Badge variant="destructive" className="flex items-center w-fit mt-1">
            <Timer className="h-3 w-3 mr-1" />
            <span className="text-xs">
                Bayar Dalam: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </Badge>
    );
};