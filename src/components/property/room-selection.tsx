"use client"

import { Users } from "lucide-react"
import type { Room } from "@/lib/types"

interface RoomSelectionProps {
  rooms: Room[]
  selectedRoomId: string | null
  onRoomSelect: (room: Room) => void
}

export function RoomSelection({ rooms, selectedRoomId, onRoomSelect }: RoomSelectionProps) {
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
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedRoomId === room.id 
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300" 
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }
            `}
            onClick={() => onRoomSelect(room)}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-semibold text-lg text-gray-900">{room.name}</h4>
                <p className="text-sm text-gray-600 mt-1 mb-2">{room.description}</p>
                <div className="flex items-center text-sm text-gray-700">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Up to {room.capacity} guests</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                {room.totalPrice !== undefined && room.dailyPrices !== undefined && (
                  <>
                    <div className="text-xl font-bold text-blue-600">
                      {room.totalPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </div>
                    <div className="text-sm text-gray-600">
                      for {room.dailyPrices.length} nights
                    </div>
                  </>
                )}
                {room.totalPrice === undefined && (
                   <div className="text-xl font-bold text-blue-600">
                     {room.basePrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}