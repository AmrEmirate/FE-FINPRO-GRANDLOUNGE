// src/components/tenant/PeakSeasonList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PeakSeason } from "./PeakSeasonDialog";
import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";

interface PeakSeasonListProps {
  seasons: PeakSeason[];
  onEdit: (season: PeakSeason) => void;
  onDelete: (seasonId: string) => void;
}

export function PeakSeasonList({ seasons, onEdit, onDelete }: PeakSeasonListProps) {
  if (seasons.length === 0) {
    return (
        <div className="text-center text-gray-500 py-8">
            <p>No peak seasons defined yet.</p>
            <p className="text-sm">Click "Add Peak Season" to add one.</p>
        </div>
    );
  }

  return (
      <Card>
        <CardHeader>
            <CardTitle>Defined Peak Seasons</CardTitle>
            <CardDescription>These are the special pricing periods you have set.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date Range</TableHead>
                        <TableHead>Adjustment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {seasons.map((season) => (
                        <TableRow key={season.id}>
                            <TableCell className="font-medium">{season.name}</TableCell>
                            <TableCell>
                                {/* --- PERBAIKAN 1 --- */}
                                {format(season.startDate, "d MMM yyyy")} - {format(season.endDate, "d MMM yyyy")}
                            </TableCell>
                            <TableCell>
                                {/* --- PERBAIKAN 2 --- */}
                                {season.adjustmentType === 'PERCENTAGE'
                                    ? `+${season.adjustmentValue}%`
                                    : `+Rp ${season.adjustmentValue.toLocaleString('id-ID')}`
                                }
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(season)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(season.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
  );
}