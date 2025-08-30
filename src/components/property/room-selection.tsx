"use client"

import { Users } from "lucide-react"
import type { Room } from "@/lib/types" // Impor tipe data Room yang sudah disesuaikan dengan API

/**
 * Interface untuk props yang diterima oleh komponen RoomSelection.
 * Ini memastikan bahwa komponen induk (halaman detail properti) menyediakan data dan fungsi yang diperlukan.
 */
interface RoomSelectionProps {
  rooms: Room[] // Daftar kamar yang tersedia untuk properti ini
  selectedRoomId: string | null // ID dari kamar yang saat ini dipilih, untuk styling
  onRoomSelect: (room: Room) => void // Fungsi callback untuk memberi tahu komponen induk saat kamar dipilih
}

/**
 * Komponen RoomSelection bertanggung jawab untuk menampilkan daftar kamar yang bisa dipilih oleh pengguna.
 */
export function RoomSelection({ rooms, selectedRoomId, onRoomSelect }: RoomSelectionProps) {
  
  // Menangani kasus di mana properti mungkin belum memiliki kamar yang terdaftar.
  if (!rooms || rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">No Rooms Available</h3>
        <p className="text-gray-600">The tenant has not listed any rooms for this property yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Your Room</h3>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            // Menerapkan styling dinamis: jika room ini adalah yang dipilih, beri highlight.
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedRoomId === room.id 
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300" 
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }
            `}
            // Memanggil fungsi onRoomSelect dari props saat div ini diklik.
            onClick={() => onRoomSelect(room)}
          >
            <div className="flex justify-between items-start gap-4">
              {/* Informasi detail kamar */}
              <div>
                <h4 className="font-semibold text-lg text-gray-900">{room.name}</h4>
                <p className="text-sm text-gray-600 mt-1 mb-2">{room.description}</p>
                <div className="flex items-center text-sm text-gray-700">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Up to {room.capacity} guests</span>
                </div>
              </div>

              {/* Informasi harga */}
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-bold text-blue-600">
                  {/* Menggunakan data `basePrice` dari API dan memformatnya ke Rupiah */}
                  Rp {room.basePrice.toLocaleString("id-ID")}
                </div>
                <div className="text-sm text-gray-600">/ night</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}