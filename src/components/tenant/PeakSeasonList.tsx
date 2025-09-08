"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// PERBAIKAN 1: Samakan tipe `adjustmentType` menjadi 'FIXED_AMOUNT'
export interface PeakSeason {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    adjustmentType: 'PERCENTAGE' | 'FIXED_AMOUNT'; // <-- Diubah dari NOMINAL
    adjustmentValue: number;
}

export interface PeakSeasonPayload extends Omit<PeakSeason, 'id'> {
    id?: string;
}

interface PeakSeasonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (season: PeakSeasonPayload) => void;
    initialData?: PeakSeason | null;
    roomId: string;
    onSuccess: () => void;
}

export default function PeakSeasonDialog({ isOpen, onClose, onSave, initialData, roomId, onSuccess }: PeakSeasonDialogProps) {
    const [name, setName] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [adjustmentType, setAdjustmentType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
    const [adjustmentValue, setAdjustmentValue] = useState<number>(0);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDateRange({ from: initialData.startDate, to: initialData.endDate });
            setAdjustmentType(initialData.adjustmentType);
            setAdjustmentValue(initialData.adjustmentValue);
        } else {
            setName('');
            setDateRange(undefined);
            setAdjustmentType('PERCENTAGE');
            setAdjustmentValue(0);
        }
    }, [initialData, isOpen]);

    const handleSave = () => {
        if (name && dateRange?.from && dateRange.to && adjustmentValue) {
            onSave({
                id: initialData?.id,
                name,
                startDate: dateRange.from,
                endDate: dateRange.to,
                adjustmentType,
                adjustmentValue
            });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Peak Season" : "Tambah Peak Season Baru"}</DialogTitle>
                    <DialogDescription>
                        Atur periode dan penyesuaian harga khusus untuk kamar ini.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="name">Nama Peak Season</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Libur Lebaran" />
                    </div>
                    <div>
                        <Label>Rentang Tanggal</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pilih rentang tanggal</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="adjustmentType">Tipe Penyesuaian</Label>
                            <Select value={adjustmentType} onValueChange={(value: 'PERCENTAGE' | 'FIXED_AMOUNT') => setAdjustmentType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                                    <SelectItem value="FIXED_AMOUNT">Nominal (Rp)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="adjustmentValue">Nilai</Label>
                            <Input
                                id="adjustmentValue"
                                type="number"
                                value={adjustmentValue}
                                onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                                placeholder={adjustmentType === 'PERCENTAGE' ? 'Contoh: 10 untuk 10%' : 'Contoh: 50000'}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSave}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}