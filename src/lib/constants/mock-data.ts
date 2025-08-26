import type { Property } from "@/lib/types"
import { type RoomCategory, type BedOption, UserRole } from "@/lib/types"
import { mockCategories } from "./categories"
import { cities } from "./cities"
import { mockProperties } from "./property-data"

// Export all required constants
export { mockCategories, cities, mockProperties }

// Function to create mock property
const createMockPropertyFunction = (
  id: number,
  tenantId: number,
  name: string,
  categoryId: number,
  description: string,
  location: string,
  latitude: number,
  longitude: number,
  provinsi: string,
  zipCode: string,
  mainImage: string,
  companyName: string,
  managerName: string,
  email: string,
  phone: string,
  rooms: Array<{
    id: number
    name: string
    category: RoomCategory
    description: string
    bedOption: BedOption
    capacity: number
    basePrice: number
  }>,
): Property => ({
  id,
  tenantId,
  name,
  categoryId,
  description,
  location,
  latitude,
  longitude,
  provinsi,
  zipCode,
  mainImage,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  tenant: {
    id: tenantId,
    userId: tenantId,
    companyName,
    addressCompany: location,
    phoneNumberCompany: phone,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    user: {
      id: tenantId,
      role: UserRole.TENANT,
      fullName: managerName,
      email,
      verified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  },
  category: mockCategories[categoryId - 1],
  rooms: rooms.map((room) => ({
    ...room,
    propertyId: id,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    property: {} as Property,
  })),
})
