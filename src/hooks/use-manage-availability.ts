// src/hooks/use-manage-availability.ts

"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { PeakSeason, PeakSeasonPayload } from "@/components/tenant/PeakSeasonDialog";

// Asumsikan tipe data ini dari API
export interface Room {
    id: string;
    name: string;
    basePrice: number;
}

// Anda akan mengganti ini dengan panggilan API sesungguhnya
const fetchRoomsForProperty = async (propertyId: string): Promise<Room[]> => {
    console.log(`Fetching rooms for property ${propertyId}...`);
    return [{ id: "room_1", name: "Mountain View Suite", basePrice: 2500000 }];
};

const fetchPeakSeasonsForRoom = async (roomId: string): Promise<PeakSeason[]> => {
    console.log(`Fetching peak seasons for room ${roomId}...`);
    return [{
        id: 'ps1', name: 'New Year 2026', startDate: new Date('2025-12-28'),
        endDate: new Date('2026-01-05'), adjustmentType: 'PERCENTAGE', adjustmentValue: 30,
    }];
};

export function useManageAvailability(propertyId: string) {
    const { toast } = useToast();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [peakSeasons, setPeakSeasons] = useState<PeakSeason[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSeason, setEditingSeason] = useState<PeakSeason | null>(null);

    // Efek untuk mengambil data awal
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            const fetchedRooms = await fetchRoomsForProperty(propertyId);
            setRooms(fetchedRooms);
            if (fetchedRooms.length > 0) {
                setSelectedRoom(fetchedRooms[0]);
            }
            setIsLoading(false);
        };
        loadInitialData();
    }, [propertyId]);

    // Efek untuk mengambil peak seasons ketika ruangan dipilih
    useEffect(() => {
        if (selectedRoom) {
            const loadPeakSeasons = async () => {
                const fetchedSeasons = await fetchPeakSeasonsForRoom(selectedRoom.id);
                setPeakSeasons(fetchedSeasons);
            };
            loadPeakSeasons();
        }
    }, [selectedRoom]);

    const handleSuccess = (message: string) => {
        toast({ title: "Success", description: message });
        // Panggil fungsi refetch data di sini jika perlu
    };

    const handleSavePeakSeason = (season: PeakSeasonPayload) => {
        if (!selectedRoom) return;
        // Logika API untuk menyimpan/memperbarui...
        console.log("Saving peak season:", season);
        setIsDialogOpen(false);
        setEditingSeason(null);
        handleSuccess(`Peak season "${season.name}" has been saved.`);
    };

    const handleDeletePeakSeason = (seasonId: string) => {
        // Logika API untuk menghapus...
        console.log("Deleting peak season:", seasonId);
        handleSuccess("Peak season has been deleted.");
    };

    const handleEditPeakSeason = (season: PeakSeason) => {
        setEditingSeason(season);
        setIsDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingSeason(null);
        setIsDialogOpen(true);
    };
    
    return {
        rooms,
        selectedRoom,
        setSelectedRoom,
        peakSeasons,
        isLoading,
        isDialogOpen,
        setIsDialogOpen,
        editingSeason,
        handleSavePeakSeason,
        handleDeletePeakSeason,
        handleEditPeakSeason,
        openAddDialog,
        handleSuccess, // Ekspor ini untuk digunakan di komponen kalender
    };
}