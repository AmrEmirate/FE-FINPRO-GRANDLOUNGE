"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Edit, Trash2, CalendarCog } from "lucide-react"
import { BedOption, RoomCategory } from "@/lib/types"

// Skema validasi untuk form kamar
const roomFormSchema = z.object({
  name: z.string().min(3, { message: "Room name must be at least 3 characters." }),
  category: z.nativeEnum(RoomCategory, { required_error: "Please select a room category." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  bedOption: z.nativeEnum(BedOption, { required_error: "Please select a bed option." }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1." }),
  basePrice: z.coerce.number().min(10000, { message: "Price must be at least 10,000." }),
})

type RoomFormValues = z.infer<typeof roomFormSchema>

interface Room {
  id: string
  name: string
  category: RoomCategory
  description: string
  bedOption: BedOption
  capacity: number
  basePrice: number
}

interface RoomsTableProps {
  propertyId: string;
  rooms: Room[]
  isLoading: boolean
  onEdit: (id: string, data: RoomFormValues) => void
  onDelete: (id: string) => void
  onCreate: (data: RoomFormValues) => void
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}

export function RoomsTable({ propertyId, rooms, isLoading, onEdit, onDelete, onCreate, isDialogOpen, setIsDialogOpen }: RoomsTableProps) {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 1,
      basePrice: 10000,
    },
  })

  useEffect(() => {
    if (isDialogOpen) {
      if (editingRoom) {
        form.reset({
          name: editingRoom.name,
          category: editingRoom.category,
          description: editingRoom.description,
          bedOption: editingRoom.bedOption,
          capacity: editingRoom.capacity,
          basePrice: editingRoom.basePrice,
        })
      } else {
        form.reset({
          name: "",
          category: undefined,
          description: "",
          bedOption: undefined,
          capacity: 1,
          basePrice: 10000,
        })
      }
    }
  }, [isDialogOpen, editingRoom, form])

  const handleEditClick = (room: Room) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }

  const onSubmit = (data: RoomFormValues) => {
    if (editingRoom) {
      onEdit(editingRoom.id, data)
    } else {
      onCreate(data)
    }
    closeDialog()
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingRoom(null)
  }

  return (
    <>
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
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.category}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>Rp {room.basePrice.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/tenant/properties/${propertyId}/rooms/${room.id}/availability`}>
                      <Button variant="ghost" size="icon" title="Manage Availability">
                        <CalendarCog className="h-4 w-4 text-blue-600" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(room)} title="Edit Room">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Delete Room" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this room?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the room.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(room.id)} className="bg-red-600 hover:bg-red-700">
                            Yes, delete room
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No rooms found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
                <DialogDescription>
                  {editingRoom ? "Update the details of your room." : "Enter the details for the new room."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Room Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.values(RoomCategory).map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="bedOption" render={({ field }) => (
                  <FormItem><FormLabel>Bed Option</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select a bed option" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {Object.values(BedOption).map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                        </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="basePrice" render={({ field }) => (
                    <FormItem><FormLabel>Base Price (Rp)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}