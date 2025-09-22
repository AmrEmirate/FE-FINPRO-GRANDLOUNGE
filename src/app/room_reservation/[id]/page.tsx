"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CountdownTimer from "@/components/room_reservation/CountdownTimer";

interface Booking {
    id: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: string;
    expiredAt: string; 
}

export default function BookingDetailPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            const res = await fetch(`/api/bookings/${id}`); 
            const data = await res.json();
            setBooking(data);
        };

        fetchBooking();
    }, [id]);

    if (!booking) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-2xl font-bold mb-4">Booking Detail</h1>

            <p><span className="font-semibold">Room:</span> {booking.roomName}</p>
            <p><span className="font-semibold">Check-in:</span> {booking.checkIn}</p>
            <p><span className="font-semibold">Check-out:</span> {booking.checkOut}</p>
            <p><span className="font-semibold">Total Price:</span> Rp {booking.totalPrice.toLocaleString()}</p>
            <p><span className="font-semibold">Status:</span> {booking.status}</p>

            <div className="mt-4">
                <CountdownTimer expiredAt={booking.expiredAt} />
            </div>

            <div className="mt-6">
                {booking.status === "PENDING" && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Upload Bukti Pembayaran
                    </button>
                )}
            </div>
        </div>
    );
}
