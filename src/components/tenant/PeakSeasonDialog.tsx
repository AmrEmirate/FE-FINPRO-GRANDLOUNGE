// src/components/tenant/PeakSeasonDialog.tsx

"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

// Definisikan tipe data untuk PeakSeason
export interface PeakSeason {
  id: string;
  name: string;
  dateRange: DateRange;
  adjustmentType: 'percentage' | 'fixed';
  adjustmentValue: number;
}

interface PeakSeasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (season: PeakSeason) => void;
  initialData?: PeakSeason | null; // Untuk mode edit
}

export function PeakSeasonDialog({ isOpen, onClose, onSave, initialData }: PeakSeasonDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adjustmentType, setAdjustmentType] = useState<'percentage' | 'fixed'>('percentage');
  const [adjustmentValue, setAdjustmentValue] = useState(0);

  // Jika ada initialData (mode edit), set state form
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDateRange(initialData.dateRange);
      setAdjustmentType(initialData.adjustmentType);
      setAdjustmentValue(initialData.adjustmentValue);
    } else {
      // Reset form jika tidak ada initialData (mode tambah baru)
      setName("");
      setDateRange(undefined);
      setAdjustmentType("percentage");
      setAdjustmentValue(0);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!name || !dateRange?.from || !dateRange?.to || adjustmentValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and ensure adjustment value is positive.",
        variant: "destructive",
      });
      return;
    }

    const newSeason: PeakSeason = {
      id: initialData?.id || new Date().toISOString(), // Gunakan id lama atau buat baru
      name,
      dateRange,
      adjustmentType,
      adjustmentValue,
    };
    onSave(newSeason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Peak Season</DialogTitle>
          <DialogDescription>
            Set a special pricing period. The price adjustment will apply to the base price of the room.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Lebaran Holiday" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date Range</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("col-span-3 justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Adjustment</Label>
            <RadioGroup defaultValue="percentage" value={adjustmentType} onValueChange={(value) => setAdjustmentType(value as any)} className="col-span-3 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="r1" />
                <Label htmlFor="r1">Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="r2" />
                <Label htmlFor="r2">Fixed</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">Value</Label>
            <div className="col-span-3 relative">
                <Input id="value" type="number" value={adjustmentValue} onChange={(e) => setAdjustmentValue(parseFloat(e.target.value) || 0)} placeholder="e.g., 20 or 500000" />
                {adjustmentType === 'percentage' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>}
                {adjustmentType === 'fixed' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}