// Enums from Prisma schema
export enum UserRole {
  TENANT = "TENANT",
  USER = "USER",
}

export enum BedOption {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  TWIN = "TWIN",
}

export enum RoomCategory {
  STANDARD = "STANDARD",
  DELUXE = "DELUXE",
  SUITE = "SUITE",
}

export enum TokenPurpose {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
}

// Base interfaces matching Prisma models
export interface User {
  id: number
  role: UserRole
  fullName: string
  email: string
  password?: string
  profilePicture?: string
  provider?: string
  providerId?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  tenant?: Tenant
  tokens?: Token[]
}

export interface Tenant {
  id: number
  userId: number
  companyName: string
  addressCompany: string
  phoneNumberCompany: string
  createdAt: Date
  updatedAt: Date
  user: User
  properties?: Property[]
}

export interface Category {
  id: number
  name: string
  properties?: Property[]
}

export interface Property {
  id: number
  tenantId: number
  name: string
  categoryId: number
  description: string
  location: string
  latitude?: number
  longitude?: number
  provinsi: string
  zipCode: string
  mainImage?: string
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  tenant: Tenant
  category: Category
  images?: PropertyImage[]
  rooms?: Room[]
}

export interface PropertyImage {
  id: number
  propertyId: number
  imageUrl: string
  property: Property
}

export interface Room {
  id: number
  propertyId: number
  name: string
  category: RoomCategory
  description: string
  bedOption: BedOption
  imageRoom?: string
  capacity: number
  basePrice: number
  createdAt: Date
  updatedAt: Date
  property: Property
  images?: RoomImage[]
  availabilities?: RoomAvailability[]
}

export interface RoomImage {
  id: number
  roomId: number
  imageUrl: string
  room: Room
}

export interface RoomAvailability {
  id: number
  roomId: number
  isAvailable: boolean
  date: Date
  price: number
  createdAt: Date
  updatedAt: Date
  room: Room
}

export interface Token {
  id: number
  token: string
  purpose: TokenPurpose
  expiresAt: Date
  userId: number
  createdAt: Date
  user: User
}

// Frontend-specific types
export interface PropertySearchParams {
  destination?: string
  checkIn?: string
  checkOut?: string
  guests?: string
  category?: string
  minPrice?: string
  maxPrice?: string
}

export interface PropertyFilters {
  priceRange: [number, number]
  categories: string[]
  amenities: string[]
  guestCount: string
  bedOptions: BedOption[]
  roomCategories: RoomCategory[]
}

export interface AuthFormData {
  fullName?: string
  email: string
  password?: string
  role?: UserRole
  companyName?: string
  addressCompany?: string
  phoneNumberCompany?: string
}
