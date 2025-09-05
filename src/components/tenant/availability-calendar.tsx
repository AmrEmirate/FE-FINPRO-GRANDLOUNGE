"use client"

import { DayPicker } from "react-day-picker";
import { addDays, eachDayOfInterval } from "date-fns";

// Definisikan tipe untuk props
interface AvailabilityCalendarProps {
  bookedDates: {
    checkIn: string;
    checkOut: string;
  }[];
}

export function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  // Logika untuk menonaktifkan tanggal yang sudah dipesan
  const disabledDays = bookedDates.flatMap(booking => {
    // Parse tanggal dan pastikan valid
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return [];
    }

    // Buat rentang tanggal dari check-in hingga satu hari sebelum check-out
    return eachDayOfInterval({
      start: checkInDate,
      end: addDays(checkOutDate, -1),
    });
  });

  return (
    <DayPicker
      mode="multiple"
      min={1} // Tampilkan beberapa bulan sekaligus jika perlu
      disabled={disabledDays}
      className="p-4 bg-white rounded-lg shadow"
      classNames={{
        day_disabled: "text-red-500 line-through opacity-50",
      }}
    />
  );
}