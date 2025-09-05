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

// Interface ini akan kita gunakan di seluruh aplikasi
export interface PeakSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  adjustmentType: 'PERCENTAGE' | 'NOMINAL';
  adjustmentValue: number;
}

export type PeakSeasonPayload = Omit<PeakSeason, 'id'> & { id?: string };

interface PeakSeasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (season: PeakSeasonPayload) => void;
  initialData?: PeakSeason | null;
}

export function PeakSeasonDialog({ isOpen, onClose, onSave, initialData }: PeakSeasonDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adjustmentType, setAdjustmentType] = useState<'PERCENTAGE' | 'NOMINAL'>('PERCENTAGE');
  const [adjustmentValue, setAdjustmentValue] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDateRange({ from: new Date(initialData.startDate), to: new Date(initialData.endDate) });
        setAdjustmentType(initialData.adjustmentType);
        setAdjustmentValue(initialData.adjustmentValue);
      } else {
        // Reset form saat dialog dibuka untuk data baru
        setName("");
        setDateRange(undefined);
        setAdjustmentType('PERCENTAGE');
        setAdjustmentValue(0);
      }
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!name || !dateRange?.from || !dateRange?.to || !adjustmentValue || adjustmentValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and ensure adjustment value is positive.",
        variant: "destructive",
      });
      return;
    }

    const payload: PeakSeasonPayload = {
      id: initialData?.id,
      name,
      startDate: dateRange.from,
      endDate: dateRange.to,
      adjustmentType,
      adjustmentValue,
    };
    onSave(payload);
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
          {/* Input Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Lebaran Holiday" />
          </div>

          {/* Date Range Picker */}
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

          {/* Adjustment Type Radio Group */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Adjustment</Label>
            <RadioGroup value={adjustmentType} onValueChange={(value) => setAdjustmentType(value as any)} className="col-span-3 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PERCENTAGE" id="r1" />
                <Label htmlFor="r1">Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NOMINAL" id="r2" />
                <Label htmlFor="r2">Nominal</Label>
              </div>
            </RadioGroup>
          </div>

          {/* PERBAIKAN PADA VALUE INPUT */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">Value</Label>
            <div className="col-span-3 relative">
              {/* Simbol ditempatkan di dalam div, bukan di dalam input */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {adjustmentType === 'NOMINAL' ? 'Rp' : ''}
              </span>
              <Input
                id="value"
                type="number"
                value={adjustmentValue || ''}
                onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                // Padding kiri ditambahkan jika tipenya nominal agar tidak tumpang tindih
                className={cn(adjustmentType === 'NOMINAL' && "pl-8")}
                placeholder={adjustmentType === 'PERCENTAGE' ? "e.g., 20" : "e.g., 50000"}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {adjustmentType === 'PERCENTAGE' ? '%' : ''}
              </span>
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