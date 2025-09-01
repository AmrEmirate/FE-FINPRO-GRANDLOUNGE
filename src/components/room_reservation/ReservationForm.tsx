"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
    setRooms: (rooms: any[]) => void;
}

export default function ReservationForm({ setRooms }: Props) {
    const [city, setCity] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.get("/api/rooms/available", {
                params: { city, checkIn, checkOut, guests },
            });
            setRooms(res.data);
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    return (
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
            {/* City */}
            <input
                type="text"
                placeholder="Destination City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border p-2 rounded"
                required
            />

            {/* Check-in */}
            <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border p-2 rounded"
                required
            />

            {/* Check-out */}
            <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border p-2 rounded"
                required
            />

            {/* Guests */}
            <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="border p-2 rounded"
                required
            />

            <button type="submit" className="col-span-1 md:col-span-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Search Rooms
            </button>
        </form>
    );
}
