"use client";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
    expiredAt: string; // waktu expired (ISO string dari BE)
}

export default function CountdownTimer({ expiredAt }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const target = new Date(expiredAt).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft("Expired");
            } else {
                const minutes = Math.floor(diff / 1000 / 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiredAt]);

    return (
        <p className={`text-lg font-semibold ${timeLeft === "Expired" ? "text-red-600" : "text-green-600"}`}>
            {timeLeft === "Expired" ? "Waktu habis" : `Sisa waktu: ${timeLeft}`}
        </p>
    );
}
