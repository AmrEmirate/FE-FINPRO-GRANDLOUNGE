'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: 'USER' | 'TENANT';
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const mappedUser: User = {
          id: decoded.id || decoded.sub, // tergantung payload JWT kamu
          fullName: decoded.fullName || decoded.name || "", // fallback kalau kosong
          email: decoded.email,
          profilePicture: decoded.profilePicture || "",
          role: decoded.role,
        };

        setUser(mappedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);

    const decoded: any = jwtDecode(token);
    const mappedUser: User = {
      id: decoded.id || decoded.sub,
      fullName: decoded.fullName || decoded.name || "",
      email: decoded.email,
      profilePicture: decoded.profilePicture || "",
      role: decoded.role,
    };

    setUser(mappedUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Redirect based on role
    if (mappedUser.role === "TENANT") {
      router.push("/tenant/dashboard");
    } else {
      router.push("/");
    }
  };


  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    router.push('/auth/login');
  };

  const value = { user, loading, login, logout }; // 2. Tambahkan `loading` di sini

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