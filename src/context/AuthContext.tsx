'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api';

// --- PERBAIKAN 1: Lengkapi tipe data User ---
interface User {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: 'USER' | 'TENANT';
  verified: boolean; // Tambahkan properti ini
  createdAt: string;  // Tambahkan properti ini
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fungsi untuk memproses token (agar tidak duplikat kode)
  const processToken = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      // --- PERBAIKAN 2: Map semua data yang dibutuhkan dari token ---
      const mappedUser: User = {
        id: decoded.id,
        fullName: decoded.fullName,
        email: decoded.email,
        profilePicture: decoded.profilePicture,
        role: decoded.role,
        verified: decoded.verified,
        createdAt: decoded.createdAt,
      };

      setUser(mappedUser);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return mappedUser;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      return null;
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      processToken(token);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    const loggedInUser = processToken(token);

    if (loggedInUser) {
      if (loggedInUser.role === "TENANT") {
        router.push("/tenant/dashboard");
      } else {
        // Untuk user biasa, bisa diarahkan ke dashboard atau halaman utama
        router.push("/");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    router.push('/auth/login');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};