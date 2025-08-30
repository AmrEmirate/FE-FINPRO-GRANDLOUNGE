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

// --- PERUBAHAN UTAMA ADA DI SINI ---
// Semua 'id' diubah menjadi 'string' untuk UUID
// Relasi seperti 'category' dan 'city' diubah menjadi objek

export interface Category {
  id: string;
  name: string;
}

export interface City {
    id: string;
    name: string;
    provinsi: string;
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
}

export interface Review {
    id: string;
    rating: number;
    comment?: string;
    user: {
        fullName: string;
        profilePicture?: string;
    }
}

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  mainImage?: string;
  deletedAt?: string;
  location: string; // Ini akan kita gabungkan dari city.name
  provinsi: string; // Ini akan kita gabungkan dari city.provinsi
  
  // Relasi sebagai objek
  category: Category; 
  city: City;
  rooms?: Room[];
  reviews?: Review[];
}

// Tipe data lain yang tidak perlu diubah
export interface User {
  id: string
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
}
