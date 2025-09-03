// src/context/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api';
import { toast } from 'sonner';

interface User {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: 'USER' | 'TENANT';
  verified: boolean;
  createdAt: string;
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

  const processToken = useCallback((token: string) => {
    try {
      const decoded: any = jwtDecode(token);
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
      delete api.defaults.headers.common["Authorization"];
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      processToken(token);
    }
    setLoading(false);
  }, [processToken]);

  const login = useCallback((token: string) => {
    localStorage.setItem("authToken", token);
    const loggedInUser = processToken(token);

    if (loggedInUser) {
      toast.success("Login Berhasil!", {
        description: "Selamat datang kembali!",
      });

      // --- PERUBAHAN UTAMA DI SINI ---
      // Pindahkan logika redirect ke timeout singkat
      // untuk memastikan toast sempat tampil dan DOM stabil.
      setTimeout(() => {
        if (loggedInUser.role === "TENANT") {
          router.replace("/tenant/dashboard");
        } else {
          router.replace("/");
        }
      }, 500); // Penundaan 500ms
    }
  }, [processToken, router]);

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