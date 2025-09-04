// src/lib/types/index.ts

// =============================================
// ENUMS (Sesuai dengan Prisma Schema di Backend)
// =============================================

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

// =============================================
// INTERFACES (Sesuai dengan Respons API)
// =============================================

export interface Category {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  provinsi: string;
}

export interface PropertyImage {
  id: string;
  imageUrl: string;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string; // Menggantikan 'type' dari mock data
  category: RoomCategory;
  description: string;
  bedOption: BedOption;
  capacity: number; // Menggantikan 'maxGuests'
  basePrice: number; 
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reply?: string | null;
  user: {
    fullName: string;
    profilePicture?: string;
  };
}

// Interface untuk data Tenant yang di-embed di dalam Property
export interface TenantInfo {
  user: {
    fullName: string;
    profilePicture?: string;
  };
  createdAt: string;
}

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  mainImage?: string;
  deletedAt?: string;
  createdAt: string; // Tambahkan createdAt untuk sorting atau info

  // Relasi sebagai objek/array objek
  category: Category;
  city: City;
  tenant: TenantInfo;
  rooms?: Room[];
  reviews?: Review[];
  images?: PropertyImage[];
}

// --- PERBAIKAN 1: Tambahkan tipe PropertyFilters ---
export interface PropertyFilters {
  priceRange?: [number, number];
  categories?: string[];
  guestCount?: string;
}

// Tipe data untuk User yang sedang login
export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  profilePicture?: string;
  provider?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOrder {
  id: string;
  orderId: string;
  invoiceNumber: string;
  property: { name: string };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_KONFIRMASI' | 'DIPROSES' | 'DIBATALKAN' | 'SELESAI';
  paymentDeadline: string;
}

export interface TenantTransaction {
  id: string;
  invoiceNumber: string;
  orderId: string;
  user: {
    name: string;
  };
  property: {
    name: string;
  };
  status: 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_KONFIRMASI' | 'DIPROSES' | 'DIBATALKAN' | 'SELESAI';
  paymentProof?: string;
}