"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BedOption, RoomCategory } from "@/lib/types"

// Skema validasi sudah benar, tidak perlu diubah
const roomFormSchema = z.object({
  name: z.string().min(3, { message: "Room name must be at least 3 characters." }),
  category: z.nativeEnum(RoomCategory, { required_error: "Please select a room category." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  bedOption: z.nativeEnum(BedOption, { required_error: "Please select a bed option." }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1." }),
  basePrice: z.coerce.number().min(10000, { message: "Price must be at least 10,000." }),
})

type RoomFormValues = z.infer<typeof roomFormSchema>

interface Room { id: string; name: string; category: RoomCategory; description: string; bedOption: BedOption; capacity: number; basePrice: number; }

interface RoomFormDialogProps {
  isOpen: boolean
  onClose: () => void
  editingRoom: Room | null
  onSave: (data: RoomFormValues, editingId: string | null) => void
}

export function RoomFormDialog({ isOpen, onClose, editingRoom, onSave }: RoomFormDialogProps) {
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
    if (isOpen) {
      if (editingRoom) {
        form.reset(editingRoom)
      } else {
        form.reset({
            name: "", category: undefined, description: "",
            bedOption: undefined, capacity: 1, basePrice: 10000,
        })
      }
    }
  }, [isOpen, editingRoom, form])

  const handleSubmit = (data: RoomFormValues) => {
    onSave(data, editingRoom?.id || null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              <DialogDescription>
                Fill in the details for the room below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Room Name</FormLabel><FormControl><Input placeholder="e.g., Deluxe Room with View" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>{Object.values(RoomCategory).map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the room..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="bedOption" render={({ field }) => (
                  <FormItem><FormLabel>Bed Option</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select bed type" /></SelectTrigger></FormControl>
                      <SelectContent>{Object.values(BedOption).map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="capacity" render={({ field }) => (
                  <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="basePrice" render={({ field }) => (
                <FormItem><FormLabel>Base Price (IDR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}