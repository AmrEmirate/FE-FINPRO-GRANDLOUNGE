"use client"

import { useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateRange: DateRange, isAvailable: boolean) => void;
  roomId: string; 
  onSuccess: () => void; 
}

export function AvailabilityDialog({ isOpen, onClose, onSave }: AvailabilityDialogProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  const handleSave = (isAvailable: boolean) => {
    if (!selectedRange?.from) {
      alert("Please select a date or date range.");
      return;
    }
    // Jika hanya satu tanggal dipilih, buat rentangnya sama
    const range: DateRange = {
      from: selectedRange.from,
      to: selectedRange.to || selectedRange.from,
    };
    onSave(range, isAvailable);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Room Availability</DialogTitle>
          <DialogDescription>
            Peringatan: Tanggal yang akan disimpan kurang 1 hari dari tanggal yang di tentukan karena masalah zona waktu.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            disabled={{ before: new Date() }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleSave(true)}>
            Mark as Available
          </Button>
          <Button variant="destructive" onClick={() => handleSave(false)}>
            Mark as Unavailable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}