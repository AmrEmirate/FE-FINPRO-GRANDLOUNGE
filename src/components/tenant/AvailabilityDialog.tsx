// src/components/tenant/AvailabilityDialog.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Definisikan props untuk dialog ini
interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (isAvailable: boolean, price: number | null) => void;
  selectedRange: DateRange | undefined;
  initialAvailable?: boolean;
  initialPrice?: number;
}

// PASTIKAN MENGGUNAKAN "export function" SEPERTI DI BAWAH INI
export function AvailabilityDialog({
  isOpen,
  onClose,
  onSave,
  selectedRange,
  initialAvailable = true,
  initialPrice = 0,
}: AvailabilityDialogProps) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [price, setPrice] = useState<number | null>(initialPrice);

  useEffect(() => {
    if (isOpen) {
      setIsAvailable(initialAvailable);
      setPrice(initialPrice || null);
    }
  }, [isOpen, initialAvailable, initialPrice]);

  const handleSave = () => {
    const finalPrice = price === 0 ? null : price;
    onSave(isAvailable, finalPrice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Ketersediaan</DialogTitle>
          <DialogDescription>
            Atur ketersediaan dan harga untuk tanggal yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-center text-sm font-semibold">
            {selectedRange?.from && format(selectedRange.from, "PPP")}
            {selectedRange?.to && ` - ${format(selectedRange.to, "PPP")}`}
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="availability-switch" checked={isAvailable} onCheckedChange={setIsAvailable} />
            <Label htmlFor="availability-switch">{isAvailable ? "Tersedia" : "Tidak Tersedia"}</Label>
          </div>
          {isAvailable && (
            <div>
              <Label htmlFor="price">Harga Spesial (kosongkan jika sama)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Gunakan harga dasar/peak season"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value) || null)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}