// src/hooks/use-login.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import { toast } from "sonner";

export function useLogin(userType: string) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Input Tidak Lengkap", { description: "Mohon isi email dan password." });
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", { ...formData, type: userType });
            const { token } = response.data.data;
            toast.success("Login Berhasil", { description: "Selamat datang kembali!" });
            login(token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan.";
            toast.error("Login Gagal", { description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        showPassword,
        setShowPassword,
        handleInputChange,
        handleSubmit,
    };
}