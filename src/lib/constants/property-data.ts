import type { Property } from "@/lib/types";
import { BedOption, RoomCategory } from "@/lib/types";
import { mockCategories } from "./categories";

// Helper function to create consistent mock data with corrected structure
const createMockProperty = (
  id: string,
  tenantId: string,
  name: string,
  categoryId: string,
  description: string,
  address: string, // Address is now a separate parameter for city name
  provinsi: string, // Province is also separate
  image: string,
  contactName: string,
  rooms: Array<{
    id: string;
    name: string;
    category: RoomCategory;
    description: string;
    bedOption: BedOption; // Ensure this uses valid enum values
    capacity: number;
    basePrice: number;
  }>
): Property => ({
  id,
  tenantId,
  name,
  description,
  mainImage: image,
  createdAt: new Date().toISOString(),
  // updatedAt DIHAPUS DARI SINI
  
  address, // Add the address property here
  
  city: {
    id: `city-${id}`, // Example city ID
    name: address,
    provinsi: provinsi,
  },
  
  category: mockCategories.find(cat => cat.id === categoryId) || mockCategories[0],
  
  tenant: {
    user: {
      fullName: contactName,
      profilePicture: "/placeholder-user.jpg",
    },
    createdAt: new Date().toISOString(),
  },
  
  rooms: rooms.map((room) => ({
    ...room,
    propertyId: id,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  
  reviews: [],
  images: [],
});

export const mockProperties: Property[] = [
  createMockProperty(
    "1", "tenant-1", "Grand Lodge Downtown", "1",
    "A luxurious hotel located in the heart of the bustling city.",
    "Jakarta", "DKI Jakarta", "/luxury-downtown-hotel.png",
    "John Doe",
    [
      {
        id: "room-101", name: "Standard Room", category: RoomCategory.STANDARD,
        description: "A cozy room with all the basic amenities.",
        bedOption: BedOption.DOUBLE, capacity: 2, basePrice: 850000,
      },
      {
        id: "room-103", name: "Executive Suite", category: RoomCategory.SUITE,
        description: "A luxurious suite with a separate living area.",
        bedOption: BedOption.DOUBLE, capacity: 4, basePrice: 2500000,
      },
    ]
  ),
  createMockProperty(
    "2", "tenant-2", "Seaside Villa Resort", "2",
    "An exquisite villa resort offering private pools.",
    "Bali", "Bali", "/seaside-villa-resort.png",
    "Jane Smith",
    [
      {
        id: "room-201", name: "One-Bedroom Villa", category: RoomCategory.DELUXE,
        description: "Private villa with a personal pool.",
        bedOption: BedOption.DOUBLE, capacity: 2, basePrice: 3500000,
      },
    ]
  ),
  createMockProperty(
    "3", "tenant-3", "Mountain View Lodge", "3",
    "A cozy lodge nestled in the mountains of Bandung.",
    "Bandung", "Jawa Barat", "/mountain-view-lodge.png",
    "Michael Chen",
    [
      {
        id: "room-301", name: "Forest View Cabin", category: RoomCategory.STANDARD,
        description: "A rustic cabin with a view of the forest.",
        bedOption: BedOption.TWIN, capacity: 2, basePrice: 750000,
      },
    ]
  ),
  createMockProperty(
    "4", "tenant-4", "Urban Boutique Hotel", "1", // Hotel category
    "A stylish boutique hotel in the trendy district of Yogyakarta.",
    "Yogyakarta", "Yogyakarta", "/urban-boutique-hotel.png",
    "Sarah Lee",
    [
      {
        id: "room-402", name: "Gallery Suite", category: RoomCategory.SUITE,
        description: "A spacious suite featuring a collection of art.",
        bedOption: BedOption.DOUBLE, capacity: 2, basePrice: 1800000,
      },
    ]
  ),
];
//dummy