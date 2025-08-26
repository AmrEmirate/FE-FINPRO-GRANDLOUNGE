"use client"

import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface Room {
  id: number
  type: string
  price: number
  maxGuests: number
  description: string
  available: boolean
}

interface RoomSelectionProps {
  rooms: Room[]
  selectedRoom: Room
  onRoomSelect: (room: Room) => void
}

export function RoomSelection({ rooms, selectedRoom, onRoomSelect }: RoomSelectionProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Available Rooms</h3>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedRoom.id === room.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            } ${!room.available ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => room.available && onRoomSelect(room)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{room.type}</h4>
                <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  Up to {room.maxGuests} guests
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">Rp {room.price.toLocaleString("id-ID")}</div>
                <div className="text-sm text-gray-600">/night</div>
                {!room.available && (
                  <Badge variant="destructive" className="mt-2">
                    Not Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
