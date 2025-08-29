"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Tipe data User yang lengkap, sesuai dengan data dari backend dan kebutuhan frontend
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'TENANT';
  verified: boolean;
  createdAt: string; // Data dari JSON (localStorage) akan berupa string
  profilePicture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Membuat context dengan nilai awal undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Komponen Provider yang akan membungkus aplikasi Anda
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading awal
  const router = useRouter();

  useEffect(() => {
    // Fungsi ini akan berjalan sekali saat aplikasi pertama kali dimuat di client
    // untuk memeriksa apakah ada data sesi di localStorage.
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // Hapus data yang korup jika ada
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false); // Selesai memeriksa, set loading ke false
    }
  }, []);

  // Fungsi untuk menangani proses login
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // Fungsi untuk menangani proses logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/auth/login'); // Arahkan kembali ke halaman login
  };

  // Nilai yang akan disediakan oleh context
  const value = {
    isAuthenticated: !!token, // Ubah token menjadi boolean (true jika ada token, false jika null)
    user,
    token,
    login,
    logout,
    isLoading, // Sediakan status loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Memberikan error jika hook digunakan di luar provider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};