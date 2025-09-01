"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, CalendarCog, MoreHorizontal, Plus } from "lucide-react"
import { BedOption, RoomCategory } from "@/lib/types"
import { RoomFormDialog } from "./room-form-dialog"
import { getBedOptionLabel, getRoomCategoryLabel } from "@/lib/constants/room-data"

// Interface untuk tipe data Room
interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  description: string;
  bedOption: BedOption;
  capacity: number;
  basePrice: number;
}

// Interface untuk props komponen
interface RoomsTableProps {
  propertyId: string;
  rooms: Room[];
  isLoading: boolean;
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onCreate: (data: any) => void;
}

export function RoomsTable({ propertyId, rooms, isLoading, onEdit, onDelete, onCreate }: RoomsTableProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  }

  const handleAddNewClick = () => {
    setEditingRoom(null);
    setIsDialogOpen(true);
  }

  const handleSave = (data: any, editingId: string | null) => {
    if (editingId) {
      onEdit(editingId, data);
    } else {
      onCreate(data);
    }
    setIsDialogOpen(false);
  }

  return (
    <>
      {/* === BAGIAN YANG DITAMBAHKAN 1: Tombol Add Room === */}
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNewClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="rounded-md border">
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
              <TableRow><TableCell colSpan={5} className="text-center h-24">Loading rooms...</TableCell></TableRow>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{getRoomCategoryLabel(room.category)}</TableCell>
                  <TableCell>{room.capacity} Guests</TableCell>
                  <TableCell>Rp {room.basePrice.toLocaleString("id-ID")}</TableCell>
                  {/* === BAGIAN YANG DITAMBAHKAN 2: Tombol Aksi === */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(room)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/tenant/properties/${propertyId}/rooms/${room.id}/availability`)}>
                          <CalendarCog className="mr-2 h-4 w-4" /> Manage Availability
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(room.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <p className="font-medium">No rooms found.</p>
                  <p className="text-sm text-gray-500">Click "Add Room" to get started.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog untuk Tambah/Edit Kamar */}
      <RoomFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingRoom={editingRoom}
        onSave={handleSave}
      />
    </>
  )
}