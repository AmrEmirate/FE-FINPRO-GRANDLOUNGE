"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

interface Props {
    room: any;
}

export default function RoomCard({ room }: Props) {
    const router = useRouter();

    const handleBook = async () => {
        try {
            const res = await axios.post("/api/reservations", {
                roomId: room.id,
                checkInDate: room.checkInDate,
                checkOutDate: room.checkOutDate,
                guestCount: room.guestCount,
            });

            // Redirect ke detail booking
            router.push(`/room_reservation/${res.data.id}`);
        } catch (err) {
            console.error("Booking error:", err);
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="font-bold text-lg">{room.name}</h2>
            <p className="text-gray-600">{room.description}</p>
            <p className="font-semibold mt-2">Rp {room.price.toLocaleString()} / night</p>
            <p className="text-sm text-gray-500">Max Guests: {room.maxGuests}</p>
            <button
                onClick={handleBook}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Book Now
            </button>
        </div>
    );
}
