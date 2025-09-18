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

// --- PERBAIKAN ---
// latitude & longitude sekarang menjadi bagian dari City
export interface City {
  id: string;
  name: string;
  provinsi: string;
  latitude?: number | string;
  longitude?: number | string;
}

// --- PERBAIKAN ---
// Interface untuk gambar properti
export interface PropertyImage {
  id: string;
  imageUrl: string; // Menggunakan imageUrl agar konsisten
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  category: RoomCategory;
  description: string;
  bedOption: BedOption;
  capacity: number;
  basePrice: number;
  roomNumber?: string;
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

export interface TenantInfo {
  user: {
    fullName: string;
    profilePicture?: string;
  };
  createdAt: string;
}

// --- PERBAIKAN UTAMA DI SINI ---
export interface Property {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  mainImage?: string;
  latitude?: number;
  longitude?: number;
  deletedAt?: string;
  createdAt: string;
  category: Category;
  city: City; // Objek City sekarang berisi data geolokasi
  tenant: TenantInfo;
  rooms?: Room[];
  reviews?: Review[];
  reviews_avg_rating?: number;
  reviews_count?: number;
  images?: PropertyImage[]; // Menggunakan interface PropertyImage yang sudah diperbaiki
  // latitude & longitude dihapus dari sini karena sudah dipindahkan ke dalam City
}

export interface PropertyFilters {
  priceRange?: [number, number];
  categories?: string[];
  guestCount?: string;
}

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
  review: any;
  id: string;
  orderId: string;
  invoiceNumber: string;
  reservationId: string;
  property: {
    id: any;
    name: string;
    mainImage: string;
  };
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