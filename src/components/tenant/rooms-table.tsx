"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Edit, Trash2, CalendarCog } from "lucide-react"
import { BedOption, RoomCategory } from "@/lib/types"
import { RoomFormDialog } from "./room-form-dialog" // 1. Impor komponen form baru

// ... (Interface Room dan Props tidak berubah) ...
interface Room { id: string; name: string; category: RoomCategory; description: string; bedOption: BedOption; capacity: number; basePrice: number; }
interface RoomsTableProps {
  propertyId: string;
  rooms: Room[];
  isLoading: boolean;
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onCreate: (data: any) => void;
}

export function RoomsTable({ propertyId, rooms, isLoading, onEdit, onDelete, onCreate }: RoomsTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const handleEditClick = (room: Room) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }

  const handleAddNewClick = () => {
    setEditingRoom(null)
    setIsDialogOpen(true)
  }

  const handleSave = (data: any, editingId: string | null) => {
    if (editingId) {
      onEdit(editingId, data)
    } else {
      onCreate(data)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-md border">
        {/* ... (Kode Tabel tidak berubah) ... */}
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.category}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>Rp {room.basePrice.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    {/* ... (Tombol-tombol aksi tidak berubah) ... */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center">No rooms found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 2. Gunakan komponen dialog form yang baru */}
      <RoomFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingRoom={editingRoom}
        onSave={handleSave}
      />
    </>
  )
}