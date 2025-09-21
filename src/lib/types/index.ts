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

export interface Amenity {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  provinsi: string;
  latitude?: number | string;
  longitude?: number | string;
}

export interface PropertyImage {
  id: string;
  imageUrl: string;
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

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  address: string | null; 
  mainImage?: string;
  latitude?: number;
  longitude?: number;
  deletedAt?: string;
  createdAt: string;
  category: Category;
  city: City;
  tenant: TenantInfo;
  rooms?: Room[];
  reviews?: Review[];
  reviews_avg_rating?: number;
  reviews_count?: number;
  images?: PropertyImage[];
  amenities?: Amenity[];
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
  paymentProof?: string | null;
  user: {
    profilePicture: string;
    fullName: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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