'use clients';

import { Badge } from '@/components/ui/badge';
import { create } from 'domain';
import { Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    expiryTimestamp: string;
    onTimerEnd: () => void;
}

export const CountdownTimer = ({
    expiryTimestamp,
    onTimerEnd,
}: CountdownTimerProps) => {
    const calculateRemainingTime = () => {
        const creationTime = new Date(expiryTimestamp).getTime();
        const expiryTime = creationTime + 60 * 60 * 1000;
        const now = new Date().getTime();
        return Math.max(0, expiryTime - now);
    };

    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

    useEffect(() => {
        if (remainingTime <= 0) {
            onTimerEnd();
            return;
        }

        const timer = setInterval(() => {
            setRemainingTime(calculateRemainingTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingTime, onTimerEnd]);

    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    if (remainingTime <= 0) return null;

    return (
        <Badge variant="destructive" className="flex items-center w-fit">
            <Timer className="h-4 w-4 mr-2" />
            <span>
                Bayar Dalam: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </Badge>
    );
};