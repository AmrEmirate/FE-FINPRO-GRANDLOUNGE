"use client";

import { PeakSeason } from "./PeakSeasonDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

interface PeakSeasonListProps {
    seasons: PeakSeason[];
    onEdit: (season: PeakSeason) => void;
    onDelete: (id: string) => void;
}

export function PeakSeasonList({ seasons, onEdit, onDelete }: PeakSeasonListProps) {
    if (!seasons || seasons.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                <p>Belum ada peak season yang ditambahkan.</p>
                <p className="text-sm text-gray-400">Klik tombol "Tambah Peak Season" untuk memulai.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {seasons.map((season) => (
                <Card key={season.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg">{season.name}</p>
                            <p className="text-sm text-gray-600">
                                {format(new Date(season.startDate), "dd MMM yyyy")} - {format(new Date(season.endDate), "dd MMM yyyy")}
                            </p>
                            <p className="text-sm text-gray-800 font-medium mt-1">
                                Penyesuaian Harga: {season.adjustmentValue}{season.adjustmentType === 'PERCENTAGE' ? '%' : ' (Nominal)'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => onEdit(season)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => onDelete(season.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}